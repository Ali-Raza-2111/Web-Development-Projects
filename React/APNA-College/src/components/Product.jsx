
import './Product.css'
import Price from './Prices.jsx'


export default function Product({title,idx}){
    let oldPrice = ['$100',"$200","$300","$400"];
    let newPrice = ["$50","$100","$150","$200"];
    return(
        
        <div className="product">
       
            <h4>{title}</h4>
            <p>
                This is the Description
            </p>
            <p><Price oldPrice={oldPrice[idx]} NewPrice={newPrice[idx]} /></p>
        </div>
    )
}

