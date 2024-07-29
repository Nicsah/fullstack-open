import React from "react";

const Notification = ({action,message}) => {
    if (message === null){
        return null
    }

    const pohja = {background: 'lightgray', padding: '10px', border: 'solid 3px' , fontSize: '24px', borderRadius:'5px'}

    const tyylit = {
    lisays : { color: 'green',borderColor:'green'},

    poisto : {color: 'yellow', borderColor: 'yellow' },

    muutos : {color: 'blue', borderColor: 'blue' },

    virhe : {color: 'red', borderColor: 'red' }

    }

    return <div style={{...pohja,...tyylit[action]}}>{message}</div>
}

export default Notification