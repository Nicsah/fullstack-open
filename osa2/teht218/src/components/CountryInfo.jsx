import React from "react";

const CountryInfo =({country,saatiedot}) => {
    if (!country || !saatiedot) {
        return null;
      }
      
      console.log(saatiedot.weather)

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Population: {country.population}</p>
            <p>Capital: {country.capital}</p>
            <p>Region: {country.region}</p>
            <p>Area: {country.area}</p>
            <p>Languages:</p>
            <ul>
                {Object.values(country.languages).map((language,index) => (
                    <li key={index}>{language}</li>
                    ))}
            </ul>
            <img src={country.flags.png} />
            <div>
                <h3>Weather in {country.capital}</h3>
                <p>temperature {saatiedot.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${saatiedot.weather[0].icon}@2x.png`} />
                <p>wind {saatiedot.wind.speed} m/s</p>
            </div>
        </div>
    )
}

export default CountryInfo