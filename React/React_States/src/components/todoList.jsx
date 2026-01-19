import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
export default function TodoList(){
    let [todo,setTodo] = useState([{task:"sample-task",id:uuidv4()}]);
    let [newtodo,setNewTodo] = useState("");

    let addNewTask = () =>{
    setTodo((PrevTodo) =>
        [...PrevTodo, { task: newtodo, id: uuidv4() }]
    );
        
            
    setNewTodo('')
}
let deleteTodo = (id) =>{
    setTodo(todo.filter((tod) => tod.id !== id));
}
    let updateTodo = (event) =>{
        setNewTodo(event.target.value);
    }
    return(
        <div>
            <h1 style={{color:'#FFD700'}}>TaskTrack</h1>
            <h4 style={{color:'#AAAAFF'}}>Because every task counts.</h4>
            <input type="text" placeholder="Enter your task" value={newtodo} onChange={updateTodo} style={{width:'200px', height:'30px', borderRadius:'10px'}}/>
            <br /> <br />
            <button onClick={addNewTask}>Add Task</button>
            <br /><br /><br />
            <hr />
            <h3>Tasks</h3>
            <ul>
                {
                    todo.map((tod) => (
                        
                        <li key={tod.id} style={{margin:"10px"}}><span>{tod.task}</span> <span><button onClick={()=>deleteTodo(tod.id)}>Delete</button></span></li>

                    ))
                }
            </ul>
        </div>
    )
}