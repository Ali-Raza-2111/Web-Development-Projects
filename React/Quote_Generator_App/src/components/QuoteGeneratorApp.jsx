import React, { useState } from 'react'

function QuoteGeneratorApp() {
    const [quote,setQuote] = useState({
        text:'',
        author:''
    })

    const fetchNewQuote= async()=>{
        console.log('clicked')
        const url = 'https://api.quotable.io/api/quotes/random'
        const response = await fetch(url)
        const data = await response.json() 
        setQuote({
            text:data.content,
            author:data.author
        })
    }

  return (
    <div className='container'>
        <div className="quote-app">
            <h1 className="app-heading">
                Quote.
            </h1>
                <i className='bx bxs-heart fav-icon'></i>
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
                <button className='btn btn-fav'>Add to favourites</button>

            </div>

        </div>
    </div>
  )
}

export default QuoteGeneratorApp
