import React from 'react'
import NavBar from './components/NavBar'
import ListNavBar from './components/ListNavBar'
import ImageSlider from './components/ImageSlider'
import FullCard from './components/FullCard'
import product from './components/FullCardsSource'
import './App.css'
function App() {
  return (
    <>
    
    <NavBar/>
    <ListNavBar/>
    <ImageSlider/>
    <div className="cards">
      <FullCard product={product[0]}/>
      <FullCard product={product[0]}/>
      <FullCard product={product[0]}/>
      <FullCard product={product[0]}/>
    </div>
    </>
  )
}

export default App