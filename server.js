'use strict';

require('dotenv').config()
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
app.use(cors());
const PORT = process.env.PORT||3000;



// ======= Routes ==========

app.get('/location', getLocation);
app.get('/weather', getWeather);

// =========================

//--- CALLBACK FUNCTIONS ------


//callback for /location route *needs to be regular funcion, NOT arrow => function
function getLocation(request, response){
  let searchQuery = request.query.data;
  console.log(searchQuery)
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
  
  // console.log(superagentResults);

  superagent.get(url).then(superagentResults => {
    let results = superagentResults.body.results[0];
    // console.log('results: ', results)
    const formatted_address = results.formatted_address;
    const lat = results.geometry.location.lat;
    const long = results.geometry.location.lng;
    const newLocation = new Location(searchQuery, formatted_address, lat, long);


    response.send(newLocation);
  }).catch(error => {
    console.log('=====================halp');
    console.error(error);
    response.status(500).send(error.message);
  })

}

function getWeather(request, response){
  
  console.log('This is the response derp :');
  console.log(response);

  // const weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${lat},${long}`;
  
  const darkSkyResults = require('./data/darksky.json');
  let darkskyDataArray = darkSkyResults.daily.data;
  const dailyArray = darkskyDataArray.map(day => {
    return new Weather(day)
  })
  response.send(dailyArray);
}

//callback for /weather route

// function getWeather(request, response){
//   const darkSkyResults = require('./data/darksky.json');
//   let darkskyDataArray = darkSkyResults.daily.data;
//   const dailyArray = darkskyDataArray.map(day => {
//     return new Weather(day)
//   })
//   response.send(dailyArray);
// }

// ------ END -----

//-------- constructor funtions
function Location(searchQuery,formatted_address, lat, long) {
  this.search_query = searchQuery;
  this.formatted_query = formatted_address;
  this.latitude = lat;
  this.longitude = long;
}

function Weather(darkskyData){
  this.time = new Date(darkskyData.time).toDateString();
  this.forecast = darkskyData.summary;
}

// --------- END --------

















//listen
app.listen(PORT,() => console.log(`listening on ${PORT}`));
