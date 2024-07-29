import React from "react";

const Countries =({countriesToShow,showCountryInfo}) => {
    return (
        <div>
            {countriesToShow.length <= 10 ? (
            countriesToShow.map(country =>
                <div key ={country.name.common}>{country.name.common}<button onClick={()=> showCountryInfo(country)}>show</button></div>
            )
            ) : (
            <p>Liikaa osumia, tarkenna hakua</p>
            )}
        </div>
    )
}

export default Countries