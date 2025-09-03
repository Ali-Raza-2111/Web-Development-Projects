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
            <input type="text" placeholder="Enter your task" value={newtodo} onChange={updateTodo}/>
            <br />
            <button onClick={addNewTask}>Add Task</button>
            <br /><br /><br />
            <hr />
            <h3>TO DO LIST</h3>
            <ul>
                {
                    todo.map((tod) => (
                        
                        <li key={tod.id}><span>{tod.task}</span> <span><button onClick={()=>deleteTodo(tod.id)}>Delete</button></span></li>

                    ))
                }
            </ul>
        </div>
    )
}