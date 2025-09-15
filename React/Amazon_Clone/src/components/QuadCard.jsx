import React from 'react'
import './FullCard.css'
import './QuadCard.css'

function QuadCard({product}) {
  return (
    <div className='card-container'>
      <div className="card-text">{product.title}</div>
      <div className="quad-card-images">
        <div className="quad-single-image">
          <img src={product.img1} alt="image 1" />
          <span>{product.img1_text}</span>

        </div>
        <div className="quad-single-image">
          <img src={product.img2} alt="image 2" />
          <span>{product.img2_text}</span>
        </div>
        <div className="quad-single-image">
          <img src={product.img3} alt="image 3" />
          <span>{product.img3_text}</span>
        </div>
        <div className="quad-single-image">
          <img src={product.img4} alt="image 4" />
          <span>{product.img4_text}</span>
        </div>
      </div>
      <div className="quad-card-title">{product.link}</div>
    </div>
  )
}

export default QuadCard