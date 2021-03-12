import axios from "axios";
import requests from "./requests";
import "./App.css";
import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const posterBaseUrl = "http://image.tmdb.org/t/p/original";

function App() {
  const MySwal = withReactContent(Swal);

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");
  const [sekeywords, setSekeywords] = useState([]);
  const [movie, setMovie] = useState([]);
  const [quote, setQuote] = useState("");

  const [driverCoords, setDriverCoords] = useState({ lng: 0, lat: 0 });
  const onSucces = ({ coords: { latitude, longitude } }) => {
    setDriverCoords({ lat: latitude, lng: longitude });
    // console.log(driverCoords);
  };
  const onError = (error) => {
    // alertError(error.toString());
    alert("Please allow your location for weather.\n" + error.toString());
    console.log(error);
  };

  useEffect(() => {
    // call_fetchGeolocationWeather();
    navigator.geolocation.watchPosition(onSucces, onError, {});
  }, []);
  useEffect(() => {
    // call_fetchGeolocationWeather();
    fetchGeolocationWeather(driverCoords.lat, driverCoords.lng);
  }, [driverCoords.lat, driverCoords.lng]);
  useEffect(() => {
    let search_keywords = localStorage.getItem("WEATHER_KEYWORDS");
    search_keywords = Boolean(search_keywords)
      ? search_keywords.split(",")
      : [];
    setSekeywords(search_keywords);
  }, []);

  const call_fetchGeolocationWeather = () => {
    //console.log(driverCoords.lat, driverCoords.lng);
    //navigator.geolocation.watchPosition(onSucces, onError, {});
    // console.log("call_fetchGeolocationWeather");
    fetchGeolocationWeather(driverCoords.lat, driverCoords.lng);
  };

  const call_fetchCityWeather = (q_city) => {
    // console.log("call_fetchCityWeather");
    setCity(q_city);
    fetchCityWeather(q_city);
  };

  const fetchGeolocationWeather = async (lat, lng) => {
    try {
      const openweathermap = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5"
      });
      const req_weather = await openweathermap.get(
        requests.fetchWeather.concat(`&lat=${lat}&lon=${lng}&units=metric`)
      );
      setWeather(req_weather.data);
      // console.log(req_weather.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCityWeather = async (q_city) => {
    try {
      // console.log("fetchCityWeather");
      const openweathermap = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5"
      });
      const req_weather = await openweathermap.get(
        requests.fetchWeather.concat(`&q=${q_city}&units=metric`)
      );
      setWeather(req_weather.data);
      // console.log(req_weather.data);

      let search_keywords = localStorage.getItem("WEATHER_KEYWORDS");
      //console.log(1, search_keywords);
      // console.log(Boolean(search_keywords));

      search_keywords = Boolean(search_keywords)
        ? search_keywords.split(",")
        : [];
      if (search_keywords.indexOf(q_city) !== -1) {
        search_keywords = arrayRemove(search_keywords, q_city);
      }

      search_keywords.unshift(q_city);
      if (search_keywords.length > 4) {
        search_keywords.length = 4;
      }
      //console.log(2, search_keywords);
      setSekeywords(search_keywords);

      localStorage.setItem("WEATHER_KEYWORDS", search_keywords);
      //console.log(3, sekeywords);
    } catch (error) {
      alertError(error.toString());
      // alert(error.toString());
      //console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const themoviedb = axios.create({
        baseURL: "https://api.themoviedb.org/3"
      });
      const req1 = await themoviedb.get(requests.fetchTrending);
      setMovie(
        req1.data.results[Math.floor(Math.random() * req1.data.results.length)]
      );
    } catch (error) {
      console.error(error);
    }
    // console.log(req1.data.results);

    try {
      const favqs_quote = axios.create({
        baseURL: "https://favqs.com/api/qotd"
      });
      const req2 = await favqs_quote.get();
      setQuote(req2.data.quote);
    } catch (error) {
      console.error(error);
    }
    // console.log(req2.data.quote);
  };

  // const truncate = (str, n) => {
  //   return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  // };

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele !== value;
    });
  }

  const sendForm = (e) => {
    e.preventDefault();

    if (!city.trim()) {
      return;
    }

    fetchCityWeather(city);
    //setCity("");
  };

  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const alertError = (msg) => {
    MySwal.fire({
      icon: "error",
      title: "Oops...",
      html: "<b style='color:red'>Please enter the exact name of the city.</b>",
      footer: msg,
      // position: "top-end",
      timer: 2000
    });
  };

  return (
    <div className="App">
      {movie.id ? (
        <div
          className="banner"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url("${posterBaseUrl}${movie?.backdrop_path}")`,
            backgroundPosition: "center center"
          }}
        >
          <form id="search_weather">
            <div className="search__container">
              <div className="search__date">{dateBuilder(new Date())}</div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={`Enter City Name`}
              />
              <button
                type="sumbit"
                onClick={sendForm}
                style={{ display: "none" }}
              >
                SEND
              </button>
              <div className="search__keywords">
                <div
                  className="search__keyword"
                  onClick={call_fetchGeolocationWeather}
                >
                  Current locataion
                </div>

                {sekeywords.map((word) => (
                  // <div key={word} onClick={() => console.log({ word })}>
                  <div
                    className="search__keyword"
                    key={word}
                    onClick={() => call_fetchCityWeather(word)}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </form>

          <div className="weather__contents">
            <h1 className="weather__title">
              {weather && weather.name}, {weather && weather.sys.country}
              {/* {movie?.title || movie?.original_title || movie?.name} */}
            </h1>

            <div className="weather__description">
              {weather && Math.round(weather.main.temp)}°c
              {/* {truncate(movie?.overview, 500)} */}
            </div>
            <div className="weather__info">
              {weather && weather.weather[0].description}
              <br />
              Min {weather && Math.round(weather.main.temp_min)}°c / Max{" "}
              {weather && Math.round(weather.main.temp_max)}°c
            </div>
          </div>

          <div className="quote__container">
            <div className="banner__buttons">
              <button className="banner__btn" onClick={fetchData}>
                New Quote
              </button>
              {/* <button className="banner__btn">My List</button> */}
            </div>
            <div className="quote__text">{quote?.body}</div>
            <div className="quote__author">{quote?.author}</div>
          </div>

          <div className="banner--fadeBottom" />
        </div>
      ) : (
        <header className="banner"></header>
      )}
    </div>
  );
}

export default App;
