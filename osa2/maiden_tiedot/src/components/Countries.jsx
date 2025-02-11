import Country from './Country'
const Countries = ({ countriesToShow, showCountry }) => {
  const length = countriesToShow.length

  if (length === 1) {
    const country = countriesToShow[0]
    return (
      <div>
        <Country country={country} />
      </div>
    )
  }

  return (
    <div>
      {length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        countriesToShow.map((country) => (
          <p key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => showCountry(country.name.common)}>
              show
            </button>
          </p>
        ))
      )}
    </div>
  )
}

export default Countries
