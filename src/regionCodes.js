import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

const RegionCodes = () => {
    const [codes, setCodes] = useState([])
    //async function to populate the region codes for reference
    const regionCodeApiCall = async () =>{
        let regions = await axios.get('/regioncodes')
        setCodes(regions.data)
    }
    //if the codes haven't been populated, make the api call.
    if(!codes.length){regionCodeApiCall()}
    /*currently the below code is a proof of concept for a future search feature i will
    be building. This was successful at searching every value of country codes
    and returning relevant codes, so I will call this a success for today. */
    let targetValue = "Sudan"
    let matches = []
    console.log(codes)
    codes.forEach((code) =>{
        if (code.name.includes(targetValue)){
            matches.push(code)
        }
    })
    console.log(matches)
    return(
        <>
            <h1>Calls happening</h1>
        </>
    )
    //call.data = [{}, {}, {}] where an object contains ISO code and name of country ({iso: iso, name: countryname})
    // setCodes(call.data)
}

ReactDOM.render(
    <>
        <RegionCodes />
    </>,
    document.getElementById('root'));