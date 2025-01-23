import { useState, useEffect } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import nameService from "./services/names"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [searchName, setSearchName] = useState("")
  const [message, setMessage] = useState({ text: null, type: null })

  useEffect(() => {
    nameService.getAll().then((initialNames) => {
      setPersons(initialNames)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    nameService.getAll().then((updatedNames) => {
      setPersons(updatedNames)

      const personToUpdate = updatedNames.find(
        (person) => person.name === newName
      )

      if (personToUpdate) {
        const confirm = window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
        if (confirm) {
          const updatedPerson = { ...personToUpdate, number: newNumber }
          nameService
            .update(personToUpdate.id, updatedPerson)
            .then((updatedPerson) => {
              setPersons(
                updatedNames.map((person) =>
                  person.id !== personToUpdate.id ? person : updatedPerson
                )
              )
              setNewName("")
              setNewNumber("")
              setMessage({
                text: `Number ${newNumber} updated to the user ${personToUpdate.name}`,
                type: "success",
              })
            })
            .catch((error) =>
              setMessage({
                text: `Information of ${personToUpdate.name} has already been removed from server`,
                type: "error",
              })
            )
        }
      } else {
        nameService
          .create(nameObject)
          .then((returnedName) => {
            setPersons(updatedNames.concat(returnedName))
            setNewName("")
            setNewNumber("")
            setMessage({
              text: `Added ${newName}`,
              type: "success",
            })
          })
          .catch((error) =>
            setMessage({
              text: `Error adding ${newName}`,
              type: "error",
            })
          )
      }
    })
    setTimeout(() => {
      setMessage({ text: null, type: null })
    }, 5000)
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().startsWith(searchName.toLowerCase())
  )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value)
  }
  const removePerson = (id) => {
    //console.log("removing person with id", id)
    const person = persons.find((person) => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      nameService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setMessage({
            text: `Deleted ${person.name}`,
            type: "success",
          })
        })
        .catch((error) =>
          setMessage({
            text: `Person ${person.name} was already removed from server`,
            type: "error",
          })
        )
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter
        searchName={searchName}
        onSearchNameChange={handleSearchNameChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
