import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ProductCard } from './components/ProductCard'
import { ProductList } from './components/ProductsList'
import { Greeting } from './components/Greeting'

function App() {
  const product = {
    imageSrc: "images/iphone.png",
    title: "iPhone 15 Pro",
    specification: [
      "A17 Pro chip with 6-core GPU",
      "3x or 5x Telephoto camera",
      "Up to 29 hours video playback",
    ],
    price: 999,
  };

  return (
    <div>

      <ProductCard product = {product}></ProductCard>
    </div>
  )
}

export default App
