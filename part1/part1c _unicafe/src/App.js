import React, { useState } from 'react'

const Button = (props) => {
  return(
    <>
    <button onClick={props.appData.handleGoodClicks}>good</button>
    <button onClick={props.appData.handleNeutralClicks}>neutral</button>
    <button onClick={props.appData.handleBadClicks}>bad</button>
    </>
  )
}
const StatisticLine = (props) => {
  return (
    
    <tr><td>{props.text}</td><td> {props.number}</td></tr>
    
  )
}
const Statistics = (props) => {
  if(props.appData.getSum === 0) {
    return (
      <p>No feedback given</p>
    )
  } else { 
    return (
      
      <table>
        <tbody>
          <StatisticLine text="good" number={props.clicks.good} />
          <StatisticLine text="neutral" number={props.clicks.neutral} />  
          <StatisticLine text="bad" number={props.clicks.bad} /> 
          <StatisticLine text="all" number={props.appData.getSum} /> 
          <StatisticLine text="average" number={((props.clicks.good/props.appData.getSum) - (props.clicks.bad/props.appData.getSum)).toFixed(2)} /> 
          <StatisticLine text="positive" number={Math.round(((props.clicks.good/props.appData.getSum))*100)+"%"} />
        </tbody>
      </table>
      
    )
  }
}

const App = () => {
  
  const [clicks, setClicks] = useState({good: 0, neutral:0, bad:0})
  const getSum = (clicks.good + clicks.neutral + clicks.bad)
  const appData = {
  handleGoodClicks: () => setClicks({...clicks, good: clicks.good + 1}),
  handleNeutralClicks: () => setClicks({...clicks, neutral: clicks.neutral + 1}),
  handleBadClicks: () => setClicks({...clicks, bad: clicks.bad + 1}),
  getSum: getSum
  }

  return(
    <>
      <h1>Please leave us your feedback</h1>
      <Button appData={appData} />
      <h1>Statistics</h1>
      <Statistics appData={appData} clicks={clicks}/>
    </>
  )
}

export default App