import { useState } from "react";



export default function LudoBoard(){
    let [moves, setMoves] = useState({blue: 0, yellow: 0, green: 0, red: 0});

    let updateBlue = ()=>{
        console.log(`blue moves ${moves.blue}`);
        setMoves((PrevMoves)=>{
            return {...PrevMoves, blue: PrevMoves.blue + 1}});
    }

    let updateYellow = ()=>{
        console.log(`blue moves ${moves.blue}`);
        setMoves((PrevMoves)=>{
            return {...PrevMoves, yellow: PrevMoves.yellow + 1}});
    }
    let updateGreen = ()=>{
       
        setMoves((PrevMoves)=>{
            return {...PrevMoves, green: PrevMoves.green + 1}});
    }
    let updateRed = ()=>{
        
        setMoves((PrevMoves)=>{
            return {...PrevMoves, red: PrevMoves.red + 1}});
    }
    return (
        <div>
            <h3>Game Begins</h3>
            <div className="board">
                <p>Blue Moves = {moves.blue}</p>
                <button style={{backgroundColor: "Blue"}} onClick={updateBlue}>+1</button>
                <p>Yellow Moves = {moves.yellow}</p>
                <button style={{backgroundColor : 'Yellow',color:'black'}} onClick={updateYellow}>+1</button>
                <p>Green Moves = {moves.green} </p>
                <button style={{backgroundColor : 'Green'}} onClick={updateGreen}>+1</button>
                <p>Red Moves = {moves.red} </p>
                <button style={{backgroundColor : 'Red'}} onClick={updateRed}>+1</button>
            </div>
        </div>
    )
}