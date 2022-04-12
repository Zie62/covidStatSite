import './app.css'
import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/Navigation';


const Results = () => {
    const [fullData, setFullData] = useState({})
    const [results, setResults] = useState({})
    //expected potential parameters from the previous page
    const expectedParams = ["iso", "region_province", "city_name", "date"]
    const params = new URLSearchParams(window.location.search);
    let options = {}
    //takes the URLSearchParam object and translates it into a regular javascript object
    if (window.location.pathname === "/global") {
        options = { global: true }
        //if there is a date in parameters, compare it to valid dates and add to options if valid.
        if (params.get("date")) {
            let date = new Date(params.get("date"))
            //if the date is valid, add it to options (otherwise, dont)
            if (date > new Date("2020-01-22") && date < new Date(Date.now() - 86400000)) {
                options.date = params.get("date")
            }
        }
    }
    else {
        for (let i = 0; i < expectedParams.length; i++) {
            let key = expectedParams[i]
            let value = params.get(expectedParams[i])
            //if the value exists, assign it to the object
            if (value) {
                options[key] = value
            }
        }
    }
    //if the site is accessed with no search params, it loads data from global-report instead
    const getReport = async () => {
        //city will be removed from options here to allow for city selection on results page
        let report = await axios.post("/report", options)
        setFullData(report.data)
        if (report.data.length == 0 || report.status == 500) {
            setResults({ empty: "empty" })
            return
        }
        //if there isnt a specified province, adds up the pieces to get overall data.
        if (options.global) {
            let data = report.data
            data.region = {}
            data.region.name = "Global"
            data.region.province = "Global"
            setResults(report.data)
        }
        else if (!options.region_province) {
            //report.data contains array of each provinces data
            let starting = report.data[0]
            if (!options.iso) {
                starting.region.name = "Overall"
            }
            starting.region.province = "Overall"
            //data from the 0th object is the starting values
            for (let i = 1; i < report.data.length; i++) {
                starting.confirmed += report.data[i].confirmed
                starting.deaths += report.data[i].deaths
                starting.confirmed_diff += report.data[i].confirmed_diff
                starting.deaths_diff += report.data[i].deaths_diff
            }
            setResults(starting)
        }
        //if a province is specified, set results equal to said province's data
        else {
            report = report.data[0]
            /*if a city has been named in the query and data has been retrieved for it,
            set the report data equal to the data for that specific city*/
            if (options.city_name && report.region.cities[0]) {
                //updates the report data with the cities specific data
                let cityData = report.region.cities[0]
                report = {
                    ...report, confirmed: cityData.confirmed,
                    confirmed_diff: cityData.confirmed_diff, deaths: cityData.deaths,
                    deaths_diff: cityData.deaths_diff
                }
            }
            setResults(report)
        }
        //return void for async resolution
        return
    }

    //renders the city select element
    const citySelector = () => {
        //if this is the global page, don't render the city or city selector (return void)
        if (options.global) {
            return
        }
        //if a specific province is selected, and that province has cities, render the city selection
        if (results.region.province != "Overall" && results.region.cities[0] && results.region.cities.length > 1) {
            return (
                <>
                    <p id="city-options-label">City:</p><br />
                    <select id="city-options" name="cities" onChange={(e) => { cityChange(e) }}>
                        <option className="options">Overall</option>
                        {results.region.cities.map((city, i) => (
                            <option className="options" key={i}>{city.name}</option>
                        ))}
                    </select>
                </>
            )
        }
        else if (results.region.cities.length == 1) {
            return (
                <h2>City: {results.region.cities[0].name}</h2>
            )
        }
    }

    //Updates displayed information if the city is changed using the selector
    const cityChange = (e) => {
        e.preventDefault();
        //e.target.value is new city
        let cities = fullData[0].region.cities
        if (e.target.value != "Overall") {
            //finds the city object with the matching name
            let localCity = cities.find(obj => {
                return obj.name === e.target.value
            })
            setResults({
                ...results, confirmed: localCity.confirmed,
                confirmed_diff: localCity.confirmed_diff, deaths: localCity.deaths,
                deaths_diff: localCity.deaths_diff
            })
        }
        else {
            //short name for ease of writing
            let fd = fullData[0]
            //return to overall stats
            setResults({
                ...results, confirmed: fd.confirmed, confirmed_diff: fd.confirmed_diff,
                deaths: fd.deaths, deaths_diff: fd.deaths_diff
            })
        }
    }

    //runs this only if the report has not yet been retrieved, and puts loading on the 
    if (Object.keys(results).length == 0) {
        getReport()
        return (
            <>
                <h1>Loading...</h1>
            </>
        )
    }
    /*gives an error message if the results returned from API request suggest invalid 
    inputs or there is another error such as the API being down*/
    else if (Object.keys(results).length == 1) {
        return (
            <>
                <h2>There is no data for the requested area.</h2>
            </>
        )
    }
    //this return is only reached with valid data to populate it.
    return (
        <>
            <div id="form-box">
                <p id="location-data">Country: {results.region.name} <br /> Province/State: {results.region.province}</p>
                {citySelector()}
                <h3 id="query-date">As of: {results.date}</h3>
                <div id="info-div">
                    <p className="info">Total Cases: {results.confirmed}</p>
                    <p className="info">Cases on this day: {results.confirmed_diff}</p>
                    <p className="info">Total Deaths: {results.deaths}</p>
                    <p className="info">Deaths on this day: {results.deaths_diff}</p>
                    <p className="info">Death Rate: {(results.deaths / results.confirmed * 100).toFixed(4)}%</p>
                    <p className="info">Please note some countries, provinces, and states only update cases weekly or on other irregular schedules.</p>
                </div>
            </div>
        </>
    )
}

ReactDOM.render(
    <>
        <NavBar />
        <Results />
    </>,
    document.getElementById("root"))
