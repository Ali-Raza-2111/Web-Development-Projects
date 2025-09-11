import './WeatherApp.css'
import sunny from '../images/sunny.png'
import cloudy from '../images/cloud.jpg'
import Snowy from '../images/Snowy.jpg'
import Rainy from '../images/Rainy.jpg'
import { useState } from 'react'

function WeatherApp() {
   
  const [data,setData] = useState({})
  const search = async()=>{
    try{
      const response = await fetch('http://127.0.0.1:8000/weather')
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
        setData(data)

    }
    catch(error){
        console.error("Failed to fetch weather:", error)
    }

  }
  
  return (
    <div className='container'>
      <div className="weather-app">
        <div className="search">
            <div className="search-top">
                <i className='fa-solid fa-location-dot'></i>
                <div className="location">London</div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder='Enter Location' />
                <i className='fa-solid fa-magnifying-glass' onClick={search}></i>
            </div>

            <div className="weather">
            <img src={sunny} alt="Sunny" />
            <div className="weather-type">Clear</div>
            <div className="temp">28°</div>
            </div>

            <div className="weather-date">
                <p>Wed, 11 sep</p>
            </div>

            <div className="weather-data">
                <div className="humidity">
                    <div className="data-name">Humidity</div>
                    <i className='fa-solid fa-droplet'></i>
                    <div className="data">55%</div>
                </div>

                <div className="wind">
                    <div className="data-name">Wind</div>
                    <i className='fa-solid fa-wind'></i>
                    <div className="data">3km/h</div>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherApp
