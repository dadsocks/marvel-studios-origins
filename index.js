const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/";

function getMarvelMovieData(callback) {
  const companyMoviesUrl = `${TMDB_SEARCH_URL}company/420/movies?api_key=a6f231ffb0d29fd46f9500b4b138e82c&language=en-US`;

  $.getJSON(companyMoviesUrl,callback);
}

function getCharacterData(movieId,callback) {
  const charactersUrl = `${TMDB_SEARCH_URL}movie/${movieId}/credits?api_key=a6f231ffb0d29fd46f9500b4b138e82c&language=en-US`;

  $.getJSON(charactersUrl,callback);
}


function renderMovies(result) {
  return `<li>
            <a href="#" id="${result.id}" class="moviePoster">
              <img class="movie scroll-item" src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.original_title}">
            </a>
          </li>`
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


function getCharacters(data) {
  //pulls character names from TMDB based on movie selection
  const characterNames = data.cast.map(cast => cast.character);
  //Cleans up name for use with Marvel API
  const cleanCharacterNames = characterNames.map(function(name) {
    if(name.includes('/') && name.includes('(voice)')) {
      let alias = name.split('/ ');
      alias = alias[alias.length - 1].split(' ');
      return alias[0];
    } else if(name.includes('/')) {
      let alias = name.split('/ ');
      return alias[alias.length - 1];
    } else if(name.includes('(voice)')) {
      let alias = name.split(' ');
      return alias[0];
    } else if(name.includes('Thor')) {
      let alias = name.split(' ');
      return alias[0];
    }
    return name;
  });
  console.log(cleanCharacterNames);

  //run function to query MarvelAPI forEach cleanCharacterName

  //run function to append HTML to DOM

}

function selectMovie() {
  $('.movie-list').on('click','.moviePoster', event => {
    const movieID = $(event.currentTarget).attr('id');
    getCharacterData(movieID,getCharacters);
  });
}


function renderPage() {
  getMarvelMovieData(marvelMovieData);
  selectMovie();
}

$(renderPage);
