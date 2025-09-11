import './WeatherApp.css'
import sunny from '../images/sunny.png'
import cloudy from '../images/cloud.png'
import Snowy from '../images/Snowy.jpg'
import Rainy from '../images/Rainy.png'
import { useState,useEffect } from 'react'

function WeatherApp() {
   
  const [data,setData] = useState({})
  const [location,setLocation] = useState('')

  useEffect(()=>{
    const fetchDefaultWeather = async()=>{
      const defaultLocation = 'Pakistan'
      const url = `http://127.0.0.1:8000/weather?city=${defaultLocation}`
      const response = await fetch(url)
      const defaultData = await response.json()
      setData(defaultData)
    }
    fetchDefaultWeather()
  },[])

  const handleInput = (e)=>{
    setLocation(e.target.value)
  }
  const search = async()=>{
    try{
      if(location.trim() !== ''){
    const response = await fetch(`http://127.0.0.1:8000/weather?city=${location}`)
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
        if(data.cod !== 200){
          setData({notFound:true})
        }
        else{
          setData(data)
          setLocation('')
        }
        
      }
      

    }
    catch(error){
        console.error("Failed to fetch weather:", error)
    }

  }

  const handleKeyDown = (e)=>{
    if(e.key == 'Enter'){
      search()
    }
  }


  const weatherImages = {
    Clear:sunny,
    Clouds:cloudy,
    Rain:Rainy,
    Snow:Snowy,
    Thunderstorm:Rainy,
    Haze:cloudy,
    Mist:cloudy
  }

  
  const weatherImage = data.weather ? weatherImages[data.weather[0].main]:null


  const backgroundImages = {
    Clear:'linear-gradient(to right,#fcb07c,#fcd283)',
    Clouds:'linear-gradient(to right,#57d6d4,#71eec)',
    Rain:'linear-gradient(to right,#5bc8fb,#80eaff)',
    Snow:'linear-gradient(to right,#aff2ff,#fff)',
    Haze:'linear-gradient(to right,#57d6d4,#71eec)',
    Mist:'linear-gradient(to right,#57d6d4,#71eec)',
    Thunderstorm:'linear-gradient(to right,#5bc8fb,#80eaff)'
  }


  const backgroundImg = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right,#fcb07c,#fcd283)'


  const currentDate = new Date()
  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthOfYear = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const dayOfWeek = daysOfWeek[currentDate.getDay()]
  const month = monthOfYear[currentDate.getMonth()]
  const dayOfMonth = currentDate.getDate()

  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`
  return (
    <div className='container' style={{backgroundImage:`${backgroundImg}`}}>
      <div className="weather-app" style={{
        backgroundImage:backgroundImg && backgroundImg.replace ?backgroundImg.replace('to right','to top'):null
      }}>
        <div className="search">
            <div className="search-top">
                <i className='fa-solid fa-location-dot'></i>
                <div className="location">{data.name}</div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder='Enter Location' value={location} onChange={handleInput} onKeyDown={handleKeyDown}/>
                <i className='fa-solid fa-magnifying-glass' onClick={search}></i>
            </div>
            
            {data.notFound ? (<div className='not-found'>Not Found 😢</div>):(
              <>
              <div className="weather">
            <img src={weatherImage} alt="Sunny" />
            <div className="weather-type">{data.weather? data.weather[0].main:null}</div>
            <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°`:null}</div>
            </div>

            <div className="weather-date">
                <p>{formattedDate}</p>
            </div>

            <div className="weather-data">
                <div className="humidity">
                    <div className="data-name">Humidity</div>
                    <i className='fa-solid fa-droplet'></i>
                    <div className="data">{data.weather? data.main.humidity:null}</div>
                </div>

                <div className="wind">
                    <div className="data-name">Wind</div>
                    <i className='fa-solid fa-wind'></i>
                    <div className="data">{data.wind?data.wind.speed:null}</div>
                </div>

            </div>
              </>
            )}
            
        </div>
      </div>
    </div>
  )
}

export default WeatherApp
