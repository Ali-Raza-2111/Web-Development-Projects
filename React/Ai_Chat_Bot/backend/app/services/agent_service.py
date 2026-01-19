from typing import List, TypedDict, Union
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, START, END
from app.config import settings


class AgentState(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]


class AgentService:
    """LangGraph Agent Service for chat processing"""

    def __init__(self):
        self.llm = ChatOllama(
            model=settings.ollama_model,
            base_url=settings.ollama_base_url,
            temperature=0,
        )
        self.agent = self._build_graph()

    def _process_node(self, state: AgentState) -> AgentState:
        """Process messages and get AI response"""
        response = self.llm.invoke(state["messages"])
        state["messages"].append(AIMessage(content=response.content))
        return state

    def _build_graph(self):
        """Build the LangGraph state graph"""
        graph = StateGraph(AgentState)
        graph.add_node("process_node", self._process_node)
        graph.add_edge(START, "process_node")
        graph.add_edge("process_node", END)
        return graph.compile()

    def convert_to_langchain_messages(
        self, messages: list[dict]
    ) -> List[Union[HumanMessage, AIMessage]]:
        """Convert database messages to LangChain message format"""
        langchain_messages = []
        for msg in messages:
            if msg["role"] == "user":
                langchain_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                langchain_messages.append(AIMessage(content=msg["content"]))
        return langchain_messages

    def chat(self, conversation_history: List[Union[HumanMessage, AIMessage]], user_message: str) -> str:
        """
        Process a chat message and return AI response
        
        Args:
            conversation_history: List of previous messages
            user_message: New user message
            
        Returns:
            AI response content
        """
        # Add user message to history
        conversation_history.append(HumanMessage(content=user_message))
        
        # Invoke the agent
        result = self.agent.invoke({"messages": conversation_history})
        
        # Get the last AI message
        ai_response = result["messages"][-1].content
        
        return ai_response


# Singleton instance
agent_service = AgentService()
