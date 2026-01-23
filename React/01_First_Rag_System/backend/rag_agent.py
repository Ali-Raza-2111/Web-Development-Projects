"""
RAG Agent with ChromaDB and LangGraph ReAct Pattern
This module combines document retrieval with the ReAct agent for intelligent responses.
"""

from typing import Annotated, Sequence, TypedDict, List, Tuple, Optional, Dict, Any
from langchain_ollama import ChatOllama
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, BaseMessage, SystemMessage
from langchain_core.tools import tool
from langchain_core.documents import Document
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
import os
import asyncio
import hashlib
from concurrent.futures import ThreadPoolExecutor

# ChromaDB persistence directory
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    context: Optional[str]
    sources: Optional[List[str]]


class RAGAgent:
    def __init__(self, model: str = "llama3.2:1b", temperature: float = 0.7):
        self.model_name = model
        self.temperature = temperature
        
        # Initialize FastEmbed embeddings (HuggingFace BGE model via ONNX - no PyTorch needed)
        self.embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        
        # Initialize ChromaDB vector store
        self.vectorstore = Chroma(
            collection_name="rag_documents",
            embedding_function=self.embeddings,
            persist_directory=CHROMA_PERSIST_DIR
        )
        
        # Text splitter for documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # Initialize LLM
        self._init_llm()
        
        # Build the graph
        self._build_graph()
        
        # Thread pool for async operations
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        # Store for retrieved source metadata (per query)
        self._current_sources: List[Dict[str, Any]] = []
    
    def _init_llm(self):
        """Initialize the LLM with tools"""
        self.llm = ChatOllama(
            model=self.model_name,
            temperature=self.temperature,
        )
        
        # Reference to self for closure
        agent_self = self
        
        # Define tools
        @tool
        def search_documents(query: str) -> str:
            """Search the knowledge base for relevant information about a topic."""
            # Use similarity_search_with_score for relevance scores
            docs_with_scores = agent_self.vectorstore.similarity_search_with_score(query, k=4)
            if not docs_with_scores:
                return "No relevant documents found in the knowledge base."
            
            result = ""
            agent_self._current_sources = []  # Reset sources for this query
            
            for i, (doc, score) in enumerate(docs_with_scores):
                filename = doc.metadata.get('source', 'Unknown')
                page = doc.metadata.get('page', None)
                
                # Generate unique chunk ID from content hash
                chunk_id = hashlib.md5(doc.page_content[:200].encode()).hexdigest()[:12]
                
                # Store detailed metadata
                source_meta = {
                    "id": chunk_id,
                    "filename": filename,
                    "page": page + 1 if page is not None else None,  # Convert to 1-indexed
                    "excerpt": doc.page_content[:500],  # First 500 chars as excerpt
                    "highlight_text": doc.page_content,  # Full text for highlighting
                    "relevance_score": round(float(1 - score), 3),  # Convert distance to similarity
                }
                agent_self._current_sources.append(source_meta)
                
                # Format for LLM with source reference
                page_info = f", Page {page + 1}" if page is not None else ""
                result += f"\n[Source {i+1}: {filename}{page_info} | ID:{chunk_id}]\n"
                result += doc.page_content + "\n"
            
            return result
        
        @tool
        def add_numbers(a: int, b: int) -> int:
            """Add two numbers together."""
            return a + b
        
        @tool
        def subtract_numbers(a: int, b: int) -> int:
            """Subtract second number from first number."""
            return a - b
        
        @tool
        def multiply_numbers(a: int, b: int) -> int:
            """Multiply two numbers together."""
            return a * b
        
        @tool
        def divide_numbers(a: float, b: float) -> float:
            """Divide first number by second number."""
            if b == 0:
                return "Error: Cannot divide by zero"
            return a / b
        
        self.tools = [search_documents, add_numbers, subtract_numbers, multiply_numbers, divide_numbers]
        self.llm_with_tools = self.llm.bind_tools(self.tools)
    
    def _build_graph(self):
        """Build the LangGraph ReAct agent graph"""
        
        def call_model(state: AgentState) -> AgentState:
            """Call the LLM with the current state"""
            system_message = SystemMessage(content="""You are NeuralRAG, an intelligent AI assistant with access to a knowledge base of uploaded documents.

CRITICAL INSTRUCTION: You MUST use the search_documents tool FIRST for EVERY question before responding.
DO NOT answer from your own knowledge. ALWAYS search the documents first.

Your capabilities:
1. search_documents - USE THIS FIRST for any question about information, policies, facts, data
2. add_numbers, subtract_numbers, multiply_numbers, divide_numbers - for math calculations

WORKFLOW:
1. User asks a question → IMMEDIATELY call search_documents with relevant keywords
2. Read the retrieved context from the tool
3. Answer based ONLY on what the documents say
4. If nothing relevant is found, say "I couldn't find this information in the uploaded documents."

NEVER make up information. NEVER answer without searching first.""")
            
            response = self.llm_with_tools.invoke([system_message] + list(state["messages"]))
            return {"messages": [response]}
        
        def should_continue(state: AgentState) -> str:
            """Determine if we should continue with tool execution"""
            messages = state["messages"]
            last_message = messages[-1]
            
            if not last_message.tool_calls:
                return "end"
            return "continue"
        
        # Build the graph
        graph = StateGraph(AgentState)
        graph.add_node("agent", call_model)
        
        tool_node = ToolNode(tools=self.tools)
        graph.add_node("tools", tool_node)
        
        graph.set_entry_point("agent")
        
        graph.add_conditional_edges(
            "agent",
            should_continue,
            {
                "continue": "tools",
                "end": END
            }
        )
        
        graph.add_edge("tools", "agent")
        
        self.app = graph.compile()
    
    async def add_document(self, file_path: str, filename: str) -> bool:
        """Add a document to the ChromaDB vector store"""
        try:
            # Load document based on file type
            if file_path.lower().endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            else:
                loader = TextLoader(file_path)
            
            documents = loader.load()
            
            # Add source metadata
            for doc in documents:
                doc.metadata['source'] = filename
            
            # Split documents
            splits = self.text_splitter.split_documents(documents)
            
            # Add to vector store
            self.vectorstore.add_documents(splits)
            
            return True
        except Exception as e:
            print(f"Error adding document: {e}")
            raise e
    
    async def remove_document(self, filename: str) -> bool:
        """Remove a document from the vector store"""
        try:
            # Get all documents with this source
            results = self.vectorstore.get(
                where={"source": filename}
            )
            
            if results and results['ids']:
                self.vectorstore.delete(ids=results['ids'])
            
            return True
        except Exception as e:
            print(f"Error removing document: {e}")
            return False
    
    def _run_sync(self, query: str, history: List[dict]) -> Tuple[str, List[Dict[str, Any]]]:
        """Synchronous execution - Always retrieve then generate"""
        # Reset current sources before query
        self._current_sources = []
        
        # STEP 1: Always retrieve relevant documents first
        docs_with_scores = self.vectorstore.similarity_search_with_score(query, k=4)
        
        context = ""
        if docs_with_scores:
            for i, (doc, score) in enumerate(docs_with_scores):
                filename = doc.metadata.get('source', 'Unknown')
                page = doc.metadata.get('page', None)
                
                # Generate unique chunk ID from content hash
                chunk_id = hashlib.md5(doc.page_content[:200].encode()).hexdigest()[:12]
                
                # Store detailed metadata
                source_meta = {
                    "id": chunk_id,
                    "filename": filename,
                    "page": page + 1 if page is not None else None,
                    "excerpt": doc.page_content[:500],
                    "highlight_text": doc.page_content,
                    "relevance_score": round(float(1 - score), 3),
                }
                self._current_sources.append(source_meta)
                
                # Build context for LLM
                page_info = f" (Page {page + 1})" if page is not None else ""
                context += f"\n--- Source {i+1}: {filename}{page_info} ---\n"
                context += doc.page_content + "\n"
        
        # STEP 2: Generate response with retrieved context
        if context:
            system_prompt = """You are a helpful assistant that answers questions based on the provided document context.
Answer the question using ONLY the information from the context below.
If the answer is not in the context, say "I couldn't find this information in the uploaded documents."
Be concise and cite the source when possible."""
            
            user_prompt = f"""Context from documents:
{context}

Question: {query}

Answer based on the context above:"""
        else:
            system_prompt = "You are a helpful assistant."
            user_prompt = f"No documents have been uploaded yet. The user asked: {query}\n\nPlease tell them to upload documents first."
        
        # Build messages with history
        messages = [SystemMessage(content=system_prompt)]
        for msg in history:
            if msg['role'] == 'user':
                messages.append(HumanMessage(content=msg['content']))
            else:
                messages.append(AIMessage(content=msg['content']))
        messages.append(HumanMessage(content=user_prompt))
        
        # Generate response
        response = self.llm.invoke(messages)
        
        return response.content, self._current_sources.copy()
    
    async def query(self, query: str, history: List[dict] = None) -> Tuple[str, List[Dict[str, Any]]]:
        """Query the RAG agent asynchronously"""
        history = history or []
        
        # Run in thread pool to not block
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_sync,
            query,
            history
        )
        
        return result
    
    async def stream_query(self, query: str, history: List[dict] = None):
        """Stream the query response"""
        history = history or []
        
        # Build messages
        messages = []
        for msg in history:
            if msg['role'] == 'user':
                messages.append(HumanMessage(content=msg['content']))
            else:
                messages.append(AIMessage(content=msg['content']))
        
        messages.append(HumanMessage(content=query))
        
        # Stream the response
        for chunk in self.app.stream({"messages": messages}, stream_mode="values"):
            last_message = chunk["messages"][-1]
            if isinstance(last_message, AIMessage) and last_message.content:
                yield last_message.content
    
    def update_settings(self, model: str = None, temperature: float = None):
        """Update agent settings"""
        if model:
            self.model_name = model
        if temperature is not None:
            self.temperature = temperature
        
        # Reinitialize LLM with new settings
        self._init_llm()
        self._build_graph()
    
    def get_settings(self) -> dict:
        """Get current settings"""
        return {
            "model": self.model_name,
            "temperature": self.temperature,
            "chroma_path": CHROMA_PERSIST_DIR,
            "document_count": self.vectorstore._collection.count() if self.vectorstore._collection else 0
        }


# For testing
if __name__ == "__main__":
    import asyncio
    
    async def test():
        agent = RAGAgent()
        
        # Test query
        response, sources = await agent.query("What is 40 + 12?")
        print(f"Response: {response}")
        print(f"Sources: {sources}")
    
    asyncio.run(test())
