import { useEffect, useState } from 'react'
import Haku from './components/Haku'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'
import axios from 'axios'

function App() {
  const [countries, setCountries] = useState([])
  const [haku, setHaku] = useState('')
  const [countryInfo, setCountryInfo] = useState(null)
  const [saatiedot, setSaatiedot] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY
  
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => setCountries(response.data))
  },[])

  const handleFilterChange = (event) => {
    setHaku(event.target.value)
  }
  const countriesToShow = haku ===''
  ? countries
  : countries.filter(country => country.name.common.toLowerCase().includes(haku.toLowerCase()))

  const showCountryInfo = (country) => {
    setCountryInfo(country)
    if ((saatiedot === null) || (saatiedot.name.toLowerCase() !== country.capital[0].toLowerCase())) {
      haeSaa(country);
    }
  }

  const haeSaa = (country) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`)
    .then(response => setSaatiedot(response.data))
  }

  useEffect(() => {
    if (countriesToShow.length === 1 && (!countryInfo || countryInfo.name.common !== countriesToShow[0].name.common)){
      showCountryInfo(countriesToShow[0])
    }
  },[countriesToShow])

  return (
    <div>
    <Haku haku={haku} handleFilterChange={handleFilterChange} />
    {countriesToShow.length === 1 ? ( 
      <CountryInfo country={countryInfo} saatiedot={saatiedot}/>
    ) : (
    <Countries countriesToShow={countriesToShow} showCountryInfo={showCountryInfo}/>
    )}
    {countryInfo && saatiedot && countriesToShow.length !== 1 && (
      <CountryInfo country={countryInfo} saatiedot={saatiedot} />
    )}
    </div>
  )

}

export default App
