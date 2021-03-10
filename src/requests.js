const movie_apiKey = process.env.REACT_APP_TMDB_APIKEY;
const weather_apiKey = process.env.REACT_APP_OPENWEATHER_APIKEY;
// console.log(weather_apiKey);

const requests = {
  fetchTrending: `/trending/all/week?api_key=${movie_apiKey}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${movie_apiKey}&witg_network=213`,
  fetchTopRated: `/movie/top_rated?api_key=${movie_apiKey}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${movie_apiKey}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${movie_apiKey}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${movie_apiKey}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${movie_apiKey}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${movie_apiKey}&with_genres=99`,

  fetchWeather: `/weather?appid=${weather_apiKey}`
};

export default requests;
