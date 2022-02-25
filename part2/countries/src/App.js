import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({city}) => {
  const [temperature, setTemperature] = useState("")
  const [overall, setOverall] = useState("")

  useEffect(() => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+process.env.REACT_APP_API_KEY)
      .then(response => {
      setTemperature(response.data.main.temp)
      setOverall(response.data.weather[0].description)
      })
  },[city])

  return(
    <>
      <h2>Wetter {city}</h2>
      <p>{overall} {(temperature - 273.15).toFixed(1)} °C</p>
    </>
  )
}

const List = ({countries, input, setInput}) => {
  
  const filterRegex = new RegExp(input,"i")
  const filteredCountries = countries.filter(country => filterRegex.test(country.name.common))
  

    if (filteredCountries.length < 11) {
      if (filteredCountries.length === 1) {
        
        return (
          <>
            <h1>{filteredCountries[0].name.common}</h1>
            <p>Capital: {filteredCountries[0].capital[0]}</p>
            <p>Population: {filteredCountries[0].population}</p>
            <h2>languages</h2>
            <ul>{Object.values(filteredCountries[0].languages).map(language => <li key={language}>{language}</li>)}</ul>
            <h2>Flag</h2>
            <img src={filteredCountries[0].flags.png} alt="no img available"/>
            <Weather city={filteredCountries[0].capital[0]}/>
          </>
        )
      }
    return (

      <ul>
      {filteredCountries.map((country, index) => 
        <React.Fragment key={country.name.common}>
          <li>{country.name.common}</li>
          <button onClick={() => setInput(country.name.common)}>show</button>
        </React.Fragment>)}
      </ul>
    )
    }

    return (
      <p>Too many matches, specify another filter</p>
    ) 
}

const App = () => {

//State
const [input, setInput] = useState("")
const [countries, setCountries] = useState([])

//Effect

useEffect(() => {
  axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
},[])

//Handlefunctions

const handleInput = (event) => {
  setInput(event.target.value)
}

//render App
  return (
    <div>
      find countries <input onChange={handleInput} value={input}/>
      <List countries={countries} input={input} setInput={setInput}/>
    </div>
  )
}

export default App