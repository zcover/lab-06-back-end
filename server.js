'use strict';

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());


//callback for /location route

let getLocation = (request, response) => {
  let searchQuery = request.query.data;
  const geoDataResults = require('./data/geo.json');
  //   const darkSkyResults = require('./data/darksky.json');
  const theLocation = new Location(searchQuery, geoDataResults);


  response.send(theLocation);
}

//callback for /weather route
let getWeather = (request, response) => {
  const darkSkyResults = require('./data/darksky.json');
  let darkskyDataArray = darkSkyResults.daily.data;
  const dailyArray = darkskyDataArray.map(day => {
    return new Weather(day)
  })
  response.send(dailyArray)
}



// constructor funtions
function Location(searchQuery, geoDataResults) {
  this.search_query = searchQuery;
  this.formatted_query = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;
}
function Weather(darkskyData){
  this.time = new Date(darkskyData.time).toDateString();
  this.forecast = darkskyData.summary;
}






app.get('/weather', getWeather());
app.get('/location', getLocation());


//listen
app.listen(PORT,() => console.log(`listening on ${PORT}`));
