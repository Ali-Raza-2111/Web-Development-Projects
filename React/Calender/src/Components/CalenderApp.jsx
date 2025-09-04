import React, { useState } from 'react'

function CalenderApp() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentDate = new Date
  const [currentMonth,setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear,setCurrentYear] = useState(currentDate.getFullYear())

  const daysInMonth = new Date(currentYear,currentMonth+1,0).getDate()
  const firstDayOfMonth = new Date(currentYear,currentMonth,1).getDay()

  const prevMonth = ()=>{
    setCurrentMonth((prevMonth)=>(prevMonth===0?11:prevMonth-1))
    setCurrentYear((prevYear)=>(currentMonth===0? prevYear-1:prevYear))
  }

  const nextMonth = ()=>{
    setCurrentMonth((prevMonth)=>(prevMonth===11 ? 0: prevMonth+1))
    setCurrentYear((prevYear)=>(currentMonth===11 ? prevYear+1 : prevYear))
  }
  return (
    <div className='calender-app'>
      <div className='calender'>
        <h1 className="heading">Calender</h1>
        <div className="navigate-date">
            <h2 className="month">{monthOfYear[currentMonth]}</h2>
            <h2 className="year">{currentYear}</h2>
            <div className="buttons">
                <i className='bx bx-chevron-left' onClick={prevMonth}></i>
                <i className='bx bx-chevron-right' onClick={nextMonth}></i>
            </div>
        </div>
        <div className="weekdays">
            {
              daysOfWeek.map((day)=>(
                <span key={day}>{day}</span>
              ))
            }
        </div>
        <div className="days">
            {
              [...Array(firstDayOfMonth).keys()].map((_,index)=>(
                <span key={`empty-${index}`}/>
              ))
            }
            {
              [...Array(daysInMonth).keys()].map((day)=>(
                <span key={day+1} className={day+1 === currentDate.getDate()&& currentMonth === currentDate.getMonth()&& currentYear ===currentDate.getFullYear()?'current-date':''}>{day +1}</span>
              ))
            }
        </div> 
      </div>


      <div className="events">
            <div className="event-popup">
                <div className="time-input">
                  <div className="event-popup-time">Time</div>
                  <input type="number" name='hours' min={0} max={24} className='hours' />
                  <input type="number" name='minutes' min={0} max={60} className='minutes' />
                </div>
                <textarea placeholder='Enter Event Text (Max 60 characters)'></textarea>
                <button className="event-popup-btn">Add Event</button>
                <button className='close-event-popup'>
                  <i className='bx bx-x'></i>
                </button>
            </div>
            <div className="event">
              <div className="event-date-wrapper">
                <div className="event-date">May 15,2025</div>
                <div className="event-time">10:00 AM</div>
              </div>
              <div className="event-text">Meeting with Ali</div>
              <div className="event-buttons">
                <i className="bx bxs-edit-alt"></i>
                <i className="bx bxs-message-alt-x"></i>
              </div>
            </div>
        </div>
    </div>
  )
}

export default CalenderApp
