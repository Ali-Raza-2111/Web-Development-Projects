import React from "react";
import "./FullCard.css";
function FullCard({ product }) {
  return (
    <div className="card-container">
      <div className="card-text">{product.text}</div>
      <div className="card-image">
        <img src={product.src} alt="Card Image" />
      </div>
      <div className="card-lower-text">{product.lowerText}</div>
    </div>
  );
}

export default FullCard;
