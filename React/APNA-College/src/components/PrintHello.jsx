function PrintHello(){
    console.log('Button was clicked');
}

export default function Button(){
    return (
        <div>
            <button onClick={PrintHello}>Click</button>
        </div>
    )
}