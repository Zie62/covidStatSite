import './app.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/Navigation';
//dataless countries which are retrieved from the API are put in this array to be filtered.
//doing this manually as it would take an extra 217 API requests per load to do procedurally.
const datalessCountries = ["Western Sahara", "Martinique", "Liechtenstein",
    "Faroe Islands", "Saint Barthelemy", "Gibraltar", "Others"]

const Options = () => {
    //options object for the various search parameters
    const [options, setOptions] = useState({ iso: "CHN", region_province: "Overall", city_name: "Overall", date: new Date(Date.now() - 86400000).toLocaleDateString("en-ca").replace(/\//ig, "-") })
    //default values hide loading in background - china is the top of the countries list for this API.
    const [selections, setSelections] = useState({ countries: [{ iso: "CHN", name: "China" }], regions: [{ province: "Overall" }], cities: [{ name: "Overall" }] })

    const handleSubmit = async (e) => {
        e.preventDefault();
        //(new Date(e.target.date.value)).toUTCString() gives utc string for entered date
        //e.target.[fieldname].value will return the relevant data from form submission.
        Object.keys(options).forEach((property) => {
            //if an option is empty, delete it before generating the redirect URL.
            if (!options[property] || options[property] == "Overall") {
                delete options[property]
            }
        })
        //generates the redirect URL using the options and adding 'report' to base URL.
        const redirect = new URL(window.location.href + "report")
        redirect.search = new URLSearchParams(options)
        //redirects the user to the results page with search parameters.
        window.location.href = redirect
    }

    useEffect(async () => {
        //updates countries and regions on load, and updates regions when a new country is selected
        try {
            let countries = await axios.post("/regioncodes", {})
            let regions = await axios.post("/localregions", { iso: options.iso })
            regions = regions.data
            countries = countries.data
            /*removes counties from regions box (only want states or other 
                relevant regions), as they dont correspond to any data*/
            if (options.iso == "USA") {
                let regex = /,\s[A-Za-z]+/
                for (let i = 0; i < regions.length; i++) {
                    if (regex.test(regions[i].province)) {
                        /*removes an entry from the regions array if it contains 
                        ', AA' as a substring where AA=state symbol
                        (ex. norfolk county, MA) as these are counties, not states*/
                        regions.splice(i, 1)
                        i--
                    }
                }
            }
            //removes manually detected dataless countries from the dropdown menu
            for (let i = 0; i < countries.length; i++) {
                if (datalessCountries.includes(countries[i].name)) {
                    countries.splice(i, 1)
                    i--
                }
            }
            //if the first regional province is empty & there are other options, remove the empty option.
            if (!regions[0].province && regions.length > 1) {
                regions.shift();
            }
            else if (regions.length == 1) {
                regions = [{ province: "Overall" }]
            }
            if (regions[0].province != "Overall") {
                regions.unshift({ province: "Overall" })
            }
            setSelections({ ...selections, countries: countries, regions: regions })
            //resets the selected index of the region-select element to 0.
            document.getElementById("region-select").selectedIndex = 0;
            setOptions({ ...options, region_province: regions[0].province })
        }
        catch (error) {
            console.log(error)
            setSelections({ ...selections, countries: [{ iso: "error", name: "there was an error retrieving data" }] })
        }
    }, options.iso, options.region_province)

    useEffect(async () => {
        /*This useEffect updates the counties / cities available to select whenever a new
        province / state is selected on the UI. */
        let cities = await axios.post("/regionreports", { iso: options.iso, region_province: options.region_province })
        cities = cities.data
        /*The API is inconsistently formatted, meaning I have to check for specific formatting
        in order to not throw errors. Some areas have an extra data object, some areas do not
        have a region field or return empty data, so this checks and selects the behavior
        needed as appropriate. */
        if (cities.data) {
            cities = cities.data[0].region.cities
            //provides an overall option for not specifying a city
            cities.unshift("Overall")
        }
        //sometimes the data immediately has an array instead of a data key with a value of an array.
        else if (cities[0]) {
            cities = cities[0].region.cities
            //sometimes this data "exists" but is empty
            if (cities.length == 0) {
                cities = [{ name: "Overall" }]
            }
            else {
                //provides an overall option for not specifying a city
                cities.unshift("Overall")
            }
        }
        //not all regions have city specific data, this covers that contingency. 
        else {
            cities = [{ name: "Overall" }]
        }
        //resets the city selector to the first option
        document.getElementById("city-select").selectedIndex = 0;
        setSelections({ ...selections, cities: cities })
        if (cities[0]) {
            setOptions({ ...options, city_name: cities[0].name })
        }
    }, options.region_province)

    return (
        <>
            <h1>COVID-19 Numbers by region and day</h1>
            <div id="form-box">
                <form id="option-inputs" onSubmit={(e) => { handleSubmit(e) }}>
                    <label className="input-labels" for="countryiso">Select your country:</label><br />
                    <select id="country-select" className="selector" name="countryiso" onChange={(e) => { setOptions({ ...options, iso: e.target.value, region_province: "", city_name: "" }) }}>
                        {selections.countries.map((country) => (
                            <option className="options" value={country.iso}>{country.name}</option>
                        ))}
                    </select><br />
                    <label className="input-labels" for="region">Select your province or state:</label><br />
                    <select id="region-select" className="selector" name="region" onChange={(e) => { setOptions({ ...options, region_province: e.target.value, city_name: "" }) }}>
                        {selections.regions.map((region, i) => (
                            <option className="options" key={i} value={region.province}>{region.province}</option>
                        ))}
                    </select><br />
                    <label className="input-labels" for='city'>Select your city's name(Not all cities have data): </label><br />
                    <select id="city-select" className="selector" name="city" onChange={(e) => { setOptions({ ...options, city_name: e.target.value }) }}>
                        {selections.cities.map((city, i) => (
                            <option className="options" key={i} value={city.name}>{city.name}</option>
                        ))}
                    </select><br />
                    <label className="input-labels" for='date'>Enter the date you want data for: </label><br />
                    {/*Max date is the day before whatever day it is, min date is first day of data for china from the API. */}
                    <input id="date-select" className="selector" max={new Date(Date.now() - 86400000).toLocaleDateString('en-ca')} min={"2020-01-22"} type="date" name="date" value={options.date} onChange={(e) => setOptions({ ...options, date: e.target.value })} /> <br />
                    <input type="submit" value="submit" />
                </form>
            </div>
        </>
    )
}

ReactDOM.render(
    <>
        <NavBar />
        <Options />
    </>,
    document.getElementById('root'));