import React, { useState } from 'react';
import ReactDOM from 'react-dom'

const Options = () => {
    const [options, setOptions] = useState({ iso: "USA", region_province: "", county_name: "", date: new Date(Date.now()).toLocaleDateString("en-ca").replace(/\//ig, "-") })
    const handleSubmit = (e) =>{
        e.preventDefault();
        //this is format for where to find value of a given parameter.
        console.log(e.target.countryiso.value);
    }
    /*when this is done it will pass these parameters to backend to make a request
    with those specific parameters. This is just the start of making a covid tracking
    site which allows you to */

    return (
        <div>
            <form id="option-inputs" onSubmit={(e) =>{handleSubmit(e)}}>
                <label className="input-labels" for="countryiso">Enter your country ISO code:</label><br />
                <input name="countryiso" value={options.iso} onChange={setOptions} /><br />
                <label className="input-labels" for="region">Enter your province's or state's code:</label><br />
                <input name="region" value={options.region_province} onChange={setOptions} /><br />
                <label className="input-labels" for='county'>Enter your county or city's name(Not all counties or cities have data): </label><br />
                <input name="county" value={options.county_name} onChange={setOptions} /><br />
                <label className="input-labels" for='date'>Enter the date you want data for (YYYY-MM-DD): </label><br />
                <input name="date" value={options.date} onChange={setOptions} />
                <input type="submit" value="submit" />
            </form>
        </div>
    )
}

ReactDOM.render(
<>
    <Options />
</>,
    document.getElementById('root'));