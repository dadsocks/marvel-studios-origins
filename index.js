const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/";

function getMarvelMovieData(callback) {
  const companyMoviesUrl = `${TMDB_SEARCH_URL}company/420/movies?api_key=a6f231ffb0d29fd46f9500b4b138e82c&language=en-US`;

  $.getJSON(companyMoviesUrl,callback);
}


function renderMovies(result) {
  return `<li>
      <img class="movie scroll-item" src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.original_title}">
  </li>
  `
}

function marvelMovieData(data) {
  const results = data.results.sort(function(a,b){

    const nameA = a.original_title.toUpperCase();
    const nameB = b.original_title.toUpperCase();

    if(nameA < nameB) {
      return -1;
    }
    if(nameA > nameB) {
      return 1;
    }
    return 0
  }).map((result) => renderMovies(result));

  $('.movie-list').html(results);
}


function renderPage() {
  getMarvelMovieData(marvelMovieData);
}

$(renderPage);
