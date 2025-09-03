
export default function ClickFunction() {
    function clickHnadler(){
        
        console.log('button clicked ')
    }
    return(
        <div>
            <button onClick={clickHnadler}>Click Me</button>
        </div>
    )
}