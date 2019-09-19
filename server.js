'use strict';

require('dotenv').config()
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;



// ======= Routes ==========

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents)

// =========================

//--- CALLBACK FUNCTIONS ------


//callback for /location route *needs to be regular funcion, NOT arrow => function
function getLocation(request, response) {
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

    console.log('sending location')
    response.send(newLocation);
  }).catch(error => {
    console.log('=====================halp');
    console.error(error);
    response.status(500).send(error.message);
  })
}
function getWeather(request, response) {
  console.log('first line of getweather')
  //   console.log('This is the response derp :');
  let lat = request.query.data.latitude;
  let long = request.query.data.latitude;
  const weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${lat},${long}`;

  console.log('about to send superagent for weather')
  superagent.get(weatherUrl).then(superagentResults => {
    console.log('inside of superagent for weather')
    let darkskyDataArray = superagentResults.body.daily.data;
    const dailyArray = darkskyDataArray.map(day => {
      return new Weather(day)
    });
    console.log('sending weather')
    response.send(dailyArray);
  }) .catch(error => {
    response.status(500).send(error.message);
    console.error(error);
  });
}
function getEvents(request, response) {
  let long = request.query.data.longitude;
  // console.log('longitude: ',long)
  let lat = request.query.data.latitude;
  // console.log('latitude: ',lat)


  let url = `https://www.eventbriteapi.com/v3/events/search?location.longitude=${long}&location.latitude=${lat}&token=${process.env.EVENTS_API_KEY}`;

  superagent.get(url).then(superEventResults => {
    console.log('inside events superagent')
    console.log(superEventResults.body)

    const eventBriteinfo = superEventResults.body.events.map(eventData => {
      const event = new Event(eventData);
      return event;
    })
    console.log('sending event')
    response.send(eventBriteinfo)
  }).catch(error => {
    response.status(500).send(error.message)
  })


}

// ------ END -----

//-------- constructor funtions

function Location(searchQuery, formatted_address, lat, long) {
  this.search_query = searchQuery;
  this.formatted_query = formatted_address;
  this.latitude = lat;
  this.longitude = long;
}
function Weather(darkskyData) {
  this.time = new Date(darkskyData.time * 1000).toDateString();
  this.forecast = darkskyData.summary;
}
function Event(eventData){
  this.link = eventData.url;
  this.name = eventData.name;
  this.event_date = new Date(eventData.start.local).toDateString();
  this.summary = eventData.summary
}
// --------- END --------


//listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));
