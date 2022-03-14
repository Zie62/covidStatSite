import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import retrieveOptions from './components/retrieveOptions';

const Options = () => {
    //options object for the various search parameters
    const [options, setOptions] = useState({ iso: "CHN", region_province: "Anhui", county_name: "", date: new Date(Date.now()).toLocaleDateString("en-ca").replace(/\//ig, "-") })
    //default values hide loading in background - china is the top of the countries list for this API.
    const [selections, setSelections] = useState({ countries: [{ iso: "CHN", name: "China" }], regions: [{ province: "" }], cities: [{ name: "" }] })
    const handleSubmit = (e) => {
        e.preventDefault();
        //e.target.[fieldname].value will return the relevant data from form submission.
        console.log((new Date(e.target.date.value)).toUTCString());
        //eventually, this will have an api call to return the relevant, selected data
    }
    useEffect(async () => {
        //updates countries and regions on load, and updates regions when a new country is selected
        let countries = await retrieveOptions("/regioncodes", {})
        let regions = await retrieveOptions("/localregions", { iso: options.iso })
        setSelections({ ...selections, countries: countries, regions: regions })
        //resets the selected index of the region-select element to 0.
        document.getElementById("region-select").selectedIndex = 0;
        setOptions({...options, region_province: regions[0].province})
    }, options.iso, options.region_province)
    useEffect(async () => {
        /*This useEffect updates the counties / cities available to select whenever a new
        province / state is selected on the UI. */
        console.log("Changed")
        console.log(options.region_province)
        let cities = await retrieveOptions("/regionreports", { iso: options.iso, province: options.region_province })
        /*The API is inconsistently formatted, meaning I have to check for specific formatting
        in order to not throw errors. Some areas have an extra data object, some areas do not
        have a region field or return empty data, so this checks and selects the behavior
        needed as appropriate. */
        if (cities.data) {
            cities = cities.data[0].region.cities
        }
        //sometimes the data immediately has an array instead of a data key with a value of an array.
        else if (cities[0]) {
            cities = cities[0].region.cities
        }
        //not all regions have city specific data, this covers that contingency. 
        else {
            cities = [{ name: "" }]
        }
        //resets the city selector to the first option
        document.getElementById("city-select").selectedIndex = 0;
        setSelections({ ...selections, cities: cities })
    }, options.region_province)
    return (
        <div>
            <form id="option-inputs" onSubmit={(e) => { handleSubmit(e) }}>
                <label className="input-labels" for="countryiso">Select your country:</label><br />
                <select id="country-select" name="countryiso" onChange={(e) => { setOptions({ ...options, iso: e.target.value, region_province: "", county_name: "" }) }}>
                    {selections.countries.map((country) => (
                        <option value={country.iso}>{country.name}</option>
                    ))}
                </select><br />
                <label className="input-labels" for="region">Select your province or state:</label><br />
                <select id="region-select" name="region" onChange={(e) => { setOptions({ ...options, region_province: e.target.value, county_name: "" }) }}>
                    {selections.regions.map((region, i) => (
                        <option key={i} value={region.province}>{region.province}</option>
                    ))}
                </select><br />
                <label className="input-labels" for='city'>Select your county or city's name(Not all counties or cities have data): </label><br />
                <select id="city-select" name="city" onChange={(e) => { setOptions({ ...options, county_name: e.target.value }) }}>
                    {selections.cities.map((city, i) => (
                        <option key={i} value={city.name}>{city.name}</option>
                    ))}
                </select><br />
                <label className="input-labels" for='date'>Enter the date you want data for: </label><br />
                <input type="date" name="date" value={options.date} onChange={(e) => setOptions({ ...options, date: e.target.value })} />
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