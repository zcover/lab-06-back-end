'use strict';

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());

const testArray = [];

//dummy data{
// "search_query": "seattle",
// "formatted_query": "Seattle, WA, USA",
// "latitude": "47.606210",
// "longitude": "-122.332071"
//}

//creating /location route
app.get('/location', (request, response) => {
  let searchQuery = request.query.data;
  const geoDataResults = require('./data/geo.json');  
//   const darkSkyResults = require('./data/darksky.json');

  const locations = new Location(searchQuery, geoDataResults);
  response.send(locations);
  console.log('testArray :', testArray);
})

// constructor
function Location(searchQuery, geoDataResults) {
  this.search_query = searchQuery;
  this.formatted_query = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;

  testArray.push(this);
}









app.listen(PORT,() => console.log(`listening on ${PORT}`));
