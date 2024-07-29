import React from "react";

const PersonForm = ({lisaahenkilo,newName,handleNameChange,newNumber,handlePhoneChange}) => {
    return(
        <form onSubmit={lisaahenkilo}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}


export default PersonForm