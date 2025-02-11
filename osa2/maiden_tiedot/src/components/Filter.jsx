const Filter = ({ searchName, onSearchNameChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input value={searchName} onChange={onSearchNameChange} />
    </div>
  )
}

export default Filter
