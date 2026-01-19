from typing import List,TypedDict,Union
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage,AIMessage
from langgraph.graph import StateGraph,START,END

llm = ChatOllama(
    model="llama3.2:1b",
    temperature=0,
)

class AgentState(TypedDict):
    message:List[Union[HumanMessage,AIMessage]]


def process_Node(state:AgentState)->AgentState:
    response = llm.invoke(state["message"])
    print("\nAi: ",response.content)
    state["message"].append(AIMessage(content=response.content))
    return state


graph = StateGraph(AgentState)
graph.add_node("process_node",process_Node)
graph.add_edge(START,"process_node")
graph.add_edge("process_node",END)
agent = graph.compile()

conversation_history = []

user_input = input("Enter: ")

while user_input!="quit":
    conversation_history.append(HumanMessage(content=user_input))
    result = agent.invoke({"message":conversation_history})
    conversation_history = result["message"]
    user_input = input("Enter: ")