import React from 'react'
import img1 from '../assets/Slider Images/image 1.jpg'
import img2 from '../assets/Slider Images/image 2.jpg'
import img3 from '../assets/Slider Images/image 3.jpg'
import img4 from '../assets/Slider Images/image 4.jpg'
import img5 from '../assets/Slider Images/image 5.jpg'

import { useState } from 'react'

import './ImageSlider.css'
function ImageSlider() {
    const images = [img1, img2, img3, img4, img5];
    const [currentIndex, setCurrentIndex] = useState(0);

    const goPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };


  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  


  return (
    <div className='slider-img-container'>
      <button onClick={goPrev} className='prev'><i class="fa-solid fa-arrow-left"></i></button>
      <img
        src={images[currentIndex]}
        alt="slider"
        className='slider-image'
      />
      <button onClick={goNext} className='next'><i class="fa-solid fa-arrow-right"></i></button>
    </div>
  )
}

export default ImageSlider  