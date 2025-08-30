
import './App.css'
import { Hello } from './components/Hello'  
import ClickFunction from './components/HelloFunction'
import { ProductCard } from './components/ProductCard'
import { ProductList } from './components/ProductList'


function App() {
   const products = [
    {
      imageSrc: "images/iphone.png",
      title: "iPhone 15 Pro",
      specification: [
        "A17 Pro chip with 6-core GPU",
        "3x or 5x Telephoto camera",
        "Up to 29 hours video playback",
      ],
      price: 999,
    },
    {
      imageSrc: "images/airpods.png",
      title: "AirPods Pro 2",
      specification: [
        "Noise Cancellation",
        "Dust, sweat, and water resistant",
        "Up to 6 hours of listening",
      ],
      price: 249,
    },
    {
      imageSrc: "images/apple-watch.png",
      title: "Apple Watch 9",
      specification: [
        "45mm or 41mm case size",
        "Always-On Retina display",
        "Up to 18 hours normal use",
      ],
      price: 399,
    },
  ];

function handlePurchase(product) {
    alert(`You clicked on ${product.title} which cost $${product.price}`);
  }

  return (
    <div className="App">
     {products.map((product) => (
          <ProductCard
            key={product.title}
            product={product}
            onPurchase={handlePurchase}
          />
        ))}
        
      <ProductList>
        <ProductCard 
          background="darkolivegreen"
          product={products[0]}
          OnPurchase={handlePurchase}
           />


        <ProductCard  product={products[1]} OnPurchase={handlePurchase}/>

        <ProductCard 
          background="peru"
          product={products[2]}
          OnPurchase={handlePurchase} />
          
      </ProductList>
      
      {/* <ClickFunction /> */}
    </div>
  )
}

export default App
