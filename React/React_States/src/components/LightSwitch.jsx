import { useState } from "react";

export default function LightSwitch(){
    let [isOn, setIsOn] = useState(false);
    let toggle = () =>{
        setIsOn(!isOn);
    }
    return(
        <div> 
            <h1>light is {isOn ? "on" : "off"}</h1>
            <button onClick={toggle}>Switch Button</button>
        </div>
    )
}