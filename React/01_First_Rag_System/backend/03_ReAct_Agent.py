from typing import Annotated,Sequence,TypedDict
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage,AIMessage,ToolMessage,BaseMessage,SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph,START,END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from IPython.display import Image, display

class AgnetState(TypedDict):
    messages:Annotated[Sequence[BaseMessage],add_messages]


@tool
def add(a:int ,b:int):
    """This function adds two numbers."""
    return a + b

@tool
def subtract(a:int ,b:int):
    """This function subtracts two numbers."""
    return a - b


tools = [add,subtract]

llm = ChatOllama(
    model="llama3.2:1b",
    temperature=0,
).bind_tools(tools)


def call_model(state:AgnetState)->AgnetState:
    system_message = SystemMessage(content="You are my AI Assistant. Please answer my query to the best of your ability.")

    response = llm.invoke([system_message]+state["messages"])
    return {"messages":[response]}

def should_continue(state:AgnetState):
    message = state["messages"]
    last_message = message[-1]

    if not last_message.tool_calls:
        return "end"
    else:
        return "continue"
    

graph = StateGraph(AgnetState)
graph.add_node("our_agent",call_model)


tool_node = ToolNode(tools = tools)

graph.add_node('tool',tool_node)

graph.set_entry_point('our_agent')


graph.add_conditional_edges(
    'our_agent',
    should_continue,
    {
        "continue":"tool",
        "end":END
    }
)

graph.add_edge('tool','our_agent')

app = graph.compile()

# Save the graph visualization
try:
    graph_image = app.get_graph().draw_mermaid_png()
    with open("03_ReAct_Agent.png", "wb") as f:
        f.write(graph_image)
    print("Graph saved as 03_ReAct_Agent.png")
except Exception as e:
    print(f"Could not save graph: {e}")

def print_stream(stream):
    for s in stream:
        message = s["messages"][-1]
        if isinstance(message, tuple):
            print(message)
        else:
            message.pretty_print()


inputs = {"messages":[("user",'Add 40 + 12 and then minus 5 from the result.')]}

print_stream(app.stream(inputs, stream_mode="values"))