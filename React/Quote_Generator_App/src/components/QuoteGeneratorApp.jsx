import React, { useState } from 'react'

function QuoteGeneratorApp() {
    const [quote,setQuote] = useState({
        text:'Simplicity is a difficult thing to achieve',
        author:'Charlie Chaplin'
    })

    const [favourite,setFavourite] = useState([])
    const [showFavourite,setShowFavourite] = useState(false)

    const toggleFavourite =  () =>{
        setShowFavourite(!showFavourite)
    }

    const addToFavourite = ()=>{
        const isAlreadyInFavourite = favourite.some((fav)=>fav.text === quote.text && fav.author === quote.author)
        if (!isAlreadyInFavourite) {
            
            setFavourite([...favourite,quote])
        }
    }

    const fetchNewQuote = async () => {
    console.log("clicked")
  try {
    const response = await fetch("http://127.0.0.1:8000/quote")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    setQuote({
      text: data.text,
      author: data.author
    })
  } catch (error) {
    console.error("Failed to fetch quote:", error)
  }
}

  return (
    <div className='container'>
        <div className="quote-app">
            <h1 className="app-heading">
                Quote.
            </h1>
                <i className='bx bxs-heart fav-icon' onClick={toggleFavourite}></i>
            <div className="quote">
                <i className='bx bxs-quote-alt-left left-quote'></i>
                <p className="quote-text">{quote.text}</p>
                <p className="quote-author">{quote.author}</p>
                <i className='bx bxs-quote-alt-right right-quote'></i>
            </div>

            <div className="circles">
                <div className="circle-1"></div>
                <div className="circle-2"></div>
                <div className="circle-3"></div>
                <div className="circle-4"></div>
            </div>


            <div className="buttons">
                <button className='btn btn-new' onClick={fetchNewQuote}>New Quote</button>
                <button className='btn btn-fav' onClick={addToFavourite}>Add to favourites</button>

            </div>
            {showFavourite &&(
                <div className="favourites">
                <button className="btn-close" onClick={toggleFavourite}>
                    <i className="bx bx-x"></i>
                </button>
                {
                    favourite.map((favQuote,index)=>(
                <div className="fav-quote" key={index}>
                    <div className="fav-quote-delete">
                        <i className="bx bx-x-circle" onClick={()=>{
                            const updatedFavourites = favourite.filter((item,i)=>i!==index)
                            setFavourite(updatedFavourites)
                        }}></i>
                    </div>
                    <div className="fav-quote-content">
                        <div className="fav-quote-text">
                            {favQuote.text}
                        </div>
                        <div className="fav-quote-author">
                            {favQuote.author}
                        </div>
                    </div>
                </div>
                ))
                }
                
            </div>
            )}
        </div>
    </div>
  )
}

export default QuoteGeneratorApp
