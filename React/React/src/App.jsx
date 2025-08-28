import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Hello } from './components/Hello'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      {/* <Greet />
      <Welcome /> */}
      <Hello name = 'Ali'/>

    </div>
  )
}

export default App
