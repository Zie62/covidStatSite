const express = require('express');
const path = require('path')
const cors = require('cors')
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

//middleware for various functionality
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'production')));
app.set('trust proxy', 1)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "production", "index.html"))
})
app.get("/report", (req, res) => {
    res.sendFile(path.join(__dirname, "production", "report.html"))
})
app.get("/global", (req, res) => {
    res.sendFile(path.join(__dirname, "production", "report.html"))
})

app.post('/regioncodes', async (req, res) => {
    let options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
            'x-rapidapi-host': process.env.RAPIDHOST,
            'x-rapidapi-key': process.env.RAPIDKEY
        }
    }
    try {
        let codes = await axios.request(options)
        res.json(codes.data.data)
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
    }
})
app.post("/localregions", async (req, res) => {
    let options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/provinces',
        params: { iso: req.body.iso },
        headers: {
            'x-rapidapi-host': process.env.RAPIDHOST,
            'x-rapidapi-key': process.env.RAPIDKEY
        }
    }
    try {
        let codes = await axios.request(options)
        res.json(codes.data.data)
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
    }
})
app.post("/regionreports", async (req, res) => {
    //this is used to get the cities of a region
    let options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/reports',
        params: req.body,
        headers: {
            'x-rapidapi-host': process.env.RAPIDHOST,
            'x-rapidapi-key': process.env.RAPIDKEY
        }
    }
    try {
        let info = await axios.request(options)
        res.json(info.data.data)
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
    }
})
app.post("/report", async (req, res) => {
    let options
    //on the global frontend page, i send an object with property global: true.
    if (req.body.global) {
        options = {
            method: 'GET',
            url: 'https://covid-19-statistics.p.rapidapi.com/reports/total',
            params: { date: req.body.date },
            headers: {
                'x-rapidapi-host': process.env.RAPIDHOST,
                'x-rapidapi-key': process.env.RAPIDKEY
            }
        }

    }
    //this supplies the final report of data from the selected options on the form.
    else {
        options = {
            method: 'GET',
            url: 'https://covid-19-statistics.p.rapidapi.com/reports',
            params: req.body,
            headers: {
                'x-rapidapi-host': process.env.RAPIDHOST,
                'x-rapidapi-key': process.env.RAPIDKEY
            }
        }
    }
    try {
        let info = await axios.request(options)
        res.json(info.data.data)
    }
    catch (error) {
        console.log(error)
        res.status(500).send();
    }
})

app.listen(PORT)