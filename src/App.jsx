import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Duel from './components/duel'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Duel/>
  )
}

export default App
