# Johns Hopkins Covid Statistics UI

This will be a covid statistics UI utilizing a Johns Hopkins covid data API (Axisbits' 'COVID-19 Statistics') through RapidAPI. Currently only have some basic proof of concept pages going on, but soon will have a functioning UI for navigating their datasets. Contains dropdowns for country (Which will autofill country ISO codes into a form) as well as other relevant data. Currently, I have the form set up and it will redirect you to a report page to give you the statistics you requested. If you want to utilize this library, make sure to get your own API keys from RapidAPI and add them to your own .env file and run `npm i`, `npm run build` before using the `npm run dstart` command to run it locally. 

Utilizing React for UI and Node.js / Express.js for backend.
