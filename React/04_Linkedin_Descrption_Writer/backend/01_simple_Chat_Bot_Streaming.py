from typing import Annotated,Sequence,TypedDict
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage,AIMessage,ToolMessage,BaseMessage,SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph,START,END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode,tools_condition
from IPython.display import Image, display

class AgentState(TypedDict):
    messages:Annotated[Sequence[BaseMessage],add_messages]

@tool
def add(a:int ,b:int):
    """This function adds two numbers."""
    return a + b

@tool
def subtract(a:int ,b:int):
    """This function subtracts two numbers."""
    return a - b


tools =  [add,subtract]


llm = ChatOllama(
    model="llama3.2:1b",
    temperature=0,
).bind_tools(tools)



def call_model(state:AgentState)->AgentState:
    system_prompt = SystemMessage(content="You are a helpful AI assistant. Answer the user's questions to the best of your ability.")

    response = llm.invoke([system_prompt]+state["messages"])
    

    return {"messages":[response]}

graph = StateGraph(AgentState)

graph.add_node("our_agent",call_model)
graph.add_node("tool_node",ToolNode(tools=tools))

graph.add_conditional_edges(
    "our_agent",
    tools_condition,
    {
        "tools":"tool_node",
        "__end__":END
    }
)

graph.add_edge("tool_node","our_agent")

graph.set_entry_point("our_agent")

app = graph.compile()

try:
    graph_image = app.get_graph().draw_mermaid_png()
    with open("01_Streaming_Agent.png", "wb") as f:
        f.write(graph_image)
    print("Graph saved as 01_Streaming_Agent.png")
except Exception as e:
    print(f"Could not save graph: {e}")

    
async def get_response():
    async for event in app.astream_events({"messages":[HumanMessage(content="What is 5 plus 3?")] },):
        if event["event"] == "on_chat_model_stream":
            print(event['data']['chunk'].content, end='', flush=True)



if __name__ == "__main__":
    import asyncio
    asyncio.run( get_response() )