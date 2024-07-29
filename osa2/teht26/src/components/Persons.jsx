import React from "react";

const Persons = ({personsToShow, poistahenkilo}) => {
    return (
    <div>
    {personsToShow.map(person =>
        <div key={person.name}>{person.name} {person.number}<button onClick={() => poistahenkilo(person.id)}>delete</button></div>)}
    </div>
    )
}

export default Persons