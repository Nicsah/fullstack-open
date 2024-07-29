import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import puhService from './services/puhelinluettelo'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, action: '' })

  useEffect(() =>{
    puhService
    .getAll()
    .then(response => {
      setPersons(response)
    })
  },[])


  const lisaaHenkilo =(event) => {
    event.preventDefault()
    const uusiHenkilo = {name: newName, number: newNumber}
    const onkouusi = persons.find(person => person.name === newName)
    if (onkouusi){
      if(window.confirm(`${newName} on jo listalla, vaihdetaanko numero uuteen?`)){
        puhService
        .update(onkouusi.id, uusiHenkilo)
        .then(response => {
          setPersons(persons.map(person => person.id === onkouusi.id ? response : person))
          setNewName('')
          setNewNumber('')
          setNotification({message:`Henkilön ${newName} numero päivitetty`, action:'muutos'})
          setTimeout(() => {
            setNotification({message: null, action: ''})
            }, 5000)
          })
          .catch(error => {
            setNotification(
              {message:`Henkilö ${newName} on jo poistettu`, action:'virhe'}
            )
            setTimeout(() => {
              setNotification({message: null, action: ''})
              }, 5000)
          })
      }
    }else{
      puhService
      .create( uusiHenkilo)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setNotification({message:`Henkilö ${newName} lisätty`, action:`lisays`})
          setTimeout(() => {
            setNotification({message: null, action: ''})
            }, 5000)
          })
  }
  }
  const poistaHenkilo = (id) => {
    const henkilonNimi = persons.find(person => person.id === id).name
    if (window.confirm(`Poistetaanko ${henkilonNimi}?`)){
    puhService
    .remove(id)
    .then(() => {
      setPersons( persons.filter(person => person.id !== id))
      setNotification({message:`Henkilö ${henkilonNimi} poistettu`, action:`poisto`})
          setTimeout(() => {
            setNotification({message: null, action: ''})
            }, 5000)
    })
  }
  }

  const handleNameChange =(event) =>{
    setNewName(event.target.value)
  }
  const handlePhoneChange =(event =>{
    setNewNumber(event.target.value)
  })

  const handleFilterChange =(event) =>{
    setFilter(event.target.value)
  }

  const personsToShow = filter === '' 
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} action={notification.action} />

      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>

      <PersonForm
        lisaahenkilo={lisaaHenkilo}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handlePhoneChange={handlePhoneChange}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} poistahenkilo={poistaHenkilo} />

    </div>
  )

}

export default App