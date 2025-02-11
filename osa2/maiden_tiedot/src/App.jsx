import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    // skip if search name is not defined
    if (searchName) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => {
          setCountries(response.data)
        })
    }
  }, [searchName])

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchName.toLowerCase())
  )

  const handleSearchNameChange = (event) => {
    event.preventDefault()
    setSearchName(event.target.value)
    setSelectedCountry(null)
  }
  const showCountry = (countryName) => {
    const country = countriesToShow.find(
      (country) => country.name.common === countryName
    )
    setSelectedCountry(country)
  }

  return (
    <div>
      <h2>Countries</h2>
      <Filter
        searchName={searchName}
        onSearchNameChange={handleSearchNameChange}
      />
      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : (
        <Countries
          countriesToShow={countriesToShow}
          showCountry={showCountry}
        />
      )}
    </div>
  )
}
export default App
