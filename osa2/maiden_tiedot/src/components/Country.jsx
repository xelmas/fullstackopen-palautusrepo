const Country = ({ country }) => {
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
    </div>
  )
}

export default Country
