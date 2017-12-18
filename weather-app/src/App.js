import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

var request = require('superagent')

var tempData = {
  minTemp: "0",
  maxTemp: "0"
};

class APIRequest{
  static get(coordinates, callback){
    console.log("latitude =", coordinates.latitude);
    request
        .get('/weather')
        .query({latitude: coordinates.latitude})
        .query({longitude: coordinates.longitude})
        .set('Accept', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .end(function(err, res) {
          callback(err, res);
        });
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_temp: "0",
      date: "0",
      latitude: "0",
      longitude: "0",
      weekData: Array(7).fill(tempData),
      min_temps: Array(7).fill("0"),
      max_temps: Array(7).fill("0"),
      windSpeed: "0",
      precipitation: "0"
    };
    this.DayForecast = this.DayForecast.bind(this);
    this.apiResponseCallback = this.apiResponseCallback.bind(this);
    this.getWeatherData = this.getWeatherData.bind(this);
    this.setLatitude = this.setLatitude.bind(this);
    this.setLongitude = this.setLongitude.bind(this);
    this.validateCoordinates = this.validateCoordinates.bind(this);
    this.setMondayDate = this.setMondayDate.bind(this);
  }

  DayForecast(props) {
    var day = "";
    var dayNo = parseInt(props.day, 10);
    switch(dayNo) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        day = "Invalid";
        break;
    }

    return               <div className="forecast">
      <div className="forecast-header">
        <div className="day">{day}</div>
      </div>
      <div className="forecast-content">
        <div className="forecast-icon">
          <img src="images/icons/icon-3.svg" alt="" width="48" />
        </div>
        <div className="degree">{parseInt(this.state.max_temps[dayNo], 10)}<sup>o</sup>C</div>
        <small>{parseInt(this.state.min_temps[dayNo], 10)}<sup>o</sup></small>
      </div>
    </div>;
  }

  apiResponseCallback(err, res){
    var response_data = res.body;
    console.log("response received: ", JSON.stringify(response_data, null));
    console.log("error: ", err);
    if ("min_temps" in response_data && "max_temps" in response_data && "wind_speeds" in response_data) {
      this.setState({
        current_temp: response_data.current_temp,
        min_temps : response_data.min_temps,
        max_temps : response_data.max_temps,
        windSpeed : response_data.wind_speeds[1]
      });
    }
  }

  setMondayDate(){
    var d = new Date();
    var day = d.getDay(),
    // diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    diff = d.getDate() - day + 1; // adjust when day is sunday
    var monday = new Date(d.setDate(diff));
    this.setState({
      date: monday.toString()
    })
    return monday.toString();
  }

  getWeatherData(){
    console.log("fetching weather data");
    this.setMondayDate();
    if(this.validateCoordinates()){
      console.log("valid coordinates received");
      var req_data = {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      APIRequest.get(req_data, this.apiResponseCallback);
    }
  }

  setLatitude(event){
    this.setState({
      latitude: event.target.value
    });
  }

  setLongitude(event){
    this.setState({
      longitude: event.target.value
    });
  }

  validateCoordinates(coordinates){
    if(isNaN(this.state.latitude) || isNaN(this.state.longitude)) { return false; }

    var lat = parseFloat(this.state.latitude, 10);
    var long = parseFloat(this.state.longitude, 10);

    if(lat < -90 || lat > 90 || long < -180|| long > 180) { return false; }
    return true;
  }

  render() {
    return (
      <div className="App">
        <div className="site-content">
          <div className="site-header">
            <div className="container">
              <a href="index.html" className="branding">
                <img src="images/logo.png" alt="" className="logo" />
                <div className="logo-type">
                  <h1 className="site-title">Weather Co</h1>
                  <small className="site-description">This website gives you weekly forecast</small>
                </div>
              </a>

            </div>
          </div> {/* site-header */}
        </div>



        <div className="fullwidth-block">
          <div className="container">
            <div className="col-md-12 col-md-offset-0">
              <h2 className="section-title">Enter Coordinates</h2>
              <form action="#" className="contact-form">
                <div className="row">
                  <div className="col-md-6"><input type="text" placeholder="Latitude..." onChange={this.setLatitude} /></div>
                  <div className="col-md-6"><input type="text" placeholder="Longitude..." onChange={this.setLongitude} /></div>
                  <div className="text-right"><input type="submit" placeholder="Submit" onClick={this.getWeatherData} /></div>
                </div>
              </form>
            </div>
          </div>
        </div>


        <div className="forecast-table">
          <div className="container">
            <div className="forecast-container">
              <div className="today forecast">
                <div className="forecast-header">
                  <div className="date">{this.state.date}</div>
                </div>
                <div className="forecast-content">
                  <div className="location">{this.state.latitude},{this.state.longitude}</div>
                  <div className="degree">
                    <div className="num">{parseInt(this.state.current_temp, 10)}<sup>o</sup>C</div>
                    <div className="forecast-icon">
                      <img src="images/icons/icon-1.svg" alt="" width="90" />
                    </div>
                  </div>
                  <span><img src="images/icon-wind.png" alt="" />{parseInt(this.state.windSpeed, 10)}</span>
                </div>
              </div>
              <this.DayForecast day="2" />
              <this.DayForecast day="3" />
              <this.DayForecast day="4" />
              <this.DayForecast day="5" />
              <this.DayForecast day="6" />
              <this.DayForecast day="0" />
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default App;
