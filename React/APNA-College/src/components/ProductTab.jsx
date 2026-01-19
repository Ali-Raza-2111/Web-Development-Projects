
import Product from './Product.jsx'

export default function ProductTab(){
    let specs = [["DPI (250)", "polling rate (90 HTZ)"],['mechanical','wireless'],['screen size (26 inch)',' resolution(1080)'],['impedance (980)', 'power handling (850)']]

    let styles = {
        display: 'flex',
    }
    return (
        <div style={styles}>

        
        <Product title="Logitec Mouse"  idx = {0} spec = {specs}/>
        <Product title="Logictec Keyboard" idx = {1} spec = {specs}/>
        <Product title = 'Logitec Monitor' idx = {2} spec = {specs}/>
        <Product title = 'Logitec Speaker' idx = {3} spec = {specs}/>
        </div>
        
    )
}

