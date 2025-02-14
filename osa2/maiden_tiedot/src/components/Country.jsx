import { useEffect, useState } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const Country = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`
      )
      .then((response) => {
        setWeatherData(response.data)
      })
  }, [country.capital])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>
        {Object.entries(country.languages).map(([key, name]) => (
          <li key={key}>{name}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={country.flags.alt}
        style={{ width: '200px', heigth: 'auto' }}
      />
      <h3>Weather in {country.capital}</h3>
      {weatherData ? (
        <>
          <div>temperature {weatherData.main.temp} Celsius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            style={{ width: '80px', heigth: 'auto' }}
          />
          <div>wind {weatherData.wind.speed} m/s</div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Country
