export default function Price({oldPrice,NewPrice}){
    let styles = {
        backgroundColor: 'yellow',
        width: '300px',
        height: '50px',
        borderBottomLeftRadius :'20px',
        borderBottomRightRadius: '20px',
        marginTop: '10px'
    }
    let crossStyle = {
        textDecoration: 'line-through'
    }
    let origionalPrice = {
        fontWeight: 'bold' 
    }
    return(
        <div style={styles}>
        <p></p>
        <span style={crossStyle}>{oldPrice}</span>
        &nbsp;&nbsp;&nbsp;
        <span style={origionalPrice}>{NewPrice}</span>
        </div>
    )
}