import { useState } from "react";
import './lottery.css'
import {genTicket, sum} from './helperfun.js'
export default  function Lottery(){
    let [ticket,setTicket] = useState(genTicket(3));
    let isWinning = sum(ticket) === 15 
    return(
        <div>
            <h2>Lottery Game!</h2>
            <div className="ticket">
                <span>{ticket[0]}</span>
                <span>{ticket[1]}</span>
                <span>{ticket[2]}</span>
            </div>
            <h3>{isWinning && "You Win"}</h3>
        </div>
    )
}