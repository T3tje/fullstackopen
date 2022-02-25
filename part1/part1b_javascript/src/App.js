import React, { useState } from 'react'

const Display = ({counter}) => <div>{counter}</div>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [ counter, setCounter ] = useState(0)
  const plusClick = () => setCounter(counter + 1);
  const minusClick = () => setCounter(counter - 1);
  const zeroClick = () => setCounter(0);
  return (
    <>
    <Display counter={counter} />
    <Button onClick={plusClick} text="plus"/>
    <Button onClick={minusClick} text="minus"/>
    <Button onClick={zeroClick} text="zero"/>
    </>
  )
}

export default App