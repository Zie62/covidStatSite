import './app.css'
import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';


const Results = () => {
    const [results, setResults] = useState({})

    //expected potential parameters from the previous page
    const expectedParams = ["iso", "region_province", "city_name", "date"]
    const params = new URLSearchParams(window.location.search);
    let options = {}
    //takes the URLSearchParam object and translates it into a regular javascript object
    for (let i = 0; i < expectedParams.length; i++) {
        let key = expectedParams[i]
        let value = params.get(expectedParams[i])
        //if the value exists, assign it to the object
        if (value) {
            options[key] = value
        }
    }
    //if the site is accessed with no search params, it loads data from global-report instead
    const getReport = async () => {
        let report = await axios.post("/report", options)
        if (report.data.length == 0 || report.status == 500) {
            setResults({ empty: "empty" })
            return
        }
        //if there isnt a specified province, adds up the pieces to get overall data.
        if (!options.region_province) {
            //report.data contains array of each provinces data
            let starting = report.data[0]
            if(!options.iso){
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
        else {
            report = report.data[0]
            console.log(report)
            setResults(report)
        }
        return
        //need to have an error handling section for empty data + network errors
    }
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
                <h2>There is no data for the requested area, inputs are otherwise invalid, or the service is currently down.</h2>
            </>
        )
    }
    //this return is only reached with valid data to populate it.
    return (
        <>
            <h1><a href={window.location.origin}>Make another request</a></h1>
            <div id="form-box">
                <h1>Country: {results.region.name} <br /> Province/State: {results.region.province}</h1>
                <h2>As of: {results.date}</h2>
                <p>Total Cases: {results.confirmed}</p>
                <p>Cases this day: {results.confirmed_diff}</p>
                <p>Total Deaths: {results.deaths}</p>
                <p>Deaths on this day: {results.deaths_diff}</p>
                <p>Death Rate: {(results.deaths / results.confirmed * 100).toFixed(4)}%</p>
                <p>Please note some states only update cases weekly or on other irregular schedules.</p>
            </div>
        </>
    )
}

ReactDOM.render(<Results />, document.getElementById("root"))
