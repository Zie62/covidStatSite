const express = require('express');
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { getHeapCodeStatistics } = require('v8');
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
app.get('/regions', (req, res) =>{
    res.sendFile(path.join(__dirname, 'production', 'regions.html'))
})
app.get('/regioncodes', async (req, res) => {
    let options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
            'x-rapidapi-host': process.env.RAPIDHOST,
            'x-rapidapi-key': process.env.RAPIDKEY
        }
    }
    try{
        let codes = await axios.request(options)
        res.json(codes.data.data)
    }
    catch(error){
        console.log(error)
        res.status(500).send();
    }
})

app.listen(PORT)