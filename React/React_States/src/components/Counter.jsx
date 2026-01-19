import { useState } from "react";


export default function CounterBtn(){
    let [count, setCount] = useState(0);
    let incCount = ()=>{
        setCount(count + 1);
        console.log(count);
    }
    return(
        <div>
        <p>counter is {count}</p>
        <button onClick={incCount}>Increase Count</button>
        </div>
    )
}