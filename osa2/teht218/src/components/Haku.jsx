import React from "react";

const Haku =({haku,handleFilterChange}) => {
    return (
        <div>
            find countries <input value={haku} onChange={handleFilterChange}/>
        </div>
    )
}

export default Haku