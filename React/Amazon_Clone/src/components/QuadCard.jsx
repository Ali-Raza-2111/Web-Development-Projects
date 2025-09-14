import React from 'react'
import './FullCard.css'
import './QuadCard.css'

function QuadCard({product}) {
  return (
    <div className='card-container'>
      <div className="card-text">{product.title}</div>
      <div className="quad-card-images">
          <img src={product.img1} alt="image 1" />
          <img src={product.img2} alt="image 2" />
          <img src={product.img3} alt="image 3" />
          <img src={product.img4} alt="image 4" />
      </div>
      <div className="card-lower-text">{product.link}</div>
    </div>
  )
}

export default QuadCard