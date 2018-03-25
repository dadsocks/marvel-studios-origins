const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/";
const MARVEL_SEARCH_URL = "https://gateway.marvel.com/v1/public/characters";
const marvelPubAPIKey = "2e2ad108fb363522f64a52b0e8bc6dd4";
const marvelPrivAPIKey = "6ef753df94be40a08951d117906a8bf0316b2753";
const timestamp = Date.now();
const hashString = timestamp + marvelPrivAPIKey + marvelPubAPIKey;
const hash = MD5(hashString);

function getMarvelMovieData(callback) {
  const companyMoviesUrl = `${TMDB_SEARCH_URL}company/420/movies?api_key=a6f231ffb0d29fd46f9500b4b138e82c&language=en-US`;

  $.getJSON(companyMoviesUrl,callback);
}

function getCharacterData(movieId,callback) {
  const charactersUrl = `${TMDB_SEARCH_URL}movie/${movieId}/credits?api_key=a6f231ffb0d29fd46f9500b4b138e82c&language=en-US`;

  $.getJSON(charactersUrl,callback);
}

function getMarvelCharacterData(character,callback) {

  $.getJSON(MARVEL_SEARCH_URL,
    {nameStartsWith: character,
      ts: timestamp,
      apikey: marvelPubAPIKey,
      hash: hash
    },
    callback);
}

function getCharacterDataByID(characterID, callback) {
  const characterURL = `${MARVEL_SEARCH_URL}/${characterID}`;

  const searchQuery = {
    ts: timestamp,
    apikey: marvelPubAPIKey,
    hash: hash
  };

  $.getJSON(characterURL,searchQuery,callback);
}


function renderMovies(result) {
  return `<li>
            <a href="#" id="${result.id}" class="moviePoster">
              <img class="movie scroll-item" src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.original_title}">
            </a>
          </li>`;
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
    } else if(name.includes('aka')) {
      let alias = name.split('aka ');
      return alias[alias.length - 1];
    }
    return name;
  });
//map through array of cleaned up character names to pull data from Marvel api for each character in array
  console.log(cleanCharacterNames);
  useCleanCharacterNames(cleanCharacterNames);

}

function useCleanCharacterNames(characters) {

  const marvelCharacterJSON = [];
  let count = 0;

  characters.forEach(function(character) {
    getMarvelCharacterData(character,function(data) {
      marvelCharacterData(data,function(data) {
        marvelCharacterJSON.push(data);
        count ++;
        console.log(count);
        if (count === marvelCharacterJSON.length) {
          $(".character-list").html(marvelCharacterJSON);
        }
      });
    });
  });
}

function marvelCharacterData(data,callback) {
  const result = data.data.results[0];
  const characterHTML = `
    <li>
      <a href="#" id="${result.id}" class="character-img">
        <figure>
          <img src="${result.thumbnail.path}/portrait_uncanny.${result.thumbnail.extension}" class="character scroll-item" alt="${result.name}">
          <figcaption>${result.name}</figcaption>
        </figure>
      </a>
    </li>
  `

  callback(characterHTML);
}

function renderCharacterBio(data) {
  const result = data.data.results[0];

  let bio = result.description;

  const bioCheck = (bio) => {if(bio == ''){return = "No Bio Available"}};

  charHTML = `
  <div class="character-bio-img">
    <img src="${result.thumbnail.path}/portrait_uncanny.${result.thumbnail.extension}" class="character" alt="Thor">
  </div>
  <div class="character-bio-content col">
    <h3 class="bio-name">${result.name}</h3>
    <section>
      <p>
        <h4 class="bio-header">Bio:</h4>
        ${bioCheck}
      </p>
    </section>
    <section>
      <h4 class="bio-header">Comic Book Stats:</h4>
      <ul>
        <li>Series: ${result.series.available}</li>
        <li>Comic Book: ${result.comics.available}</li>
        <li>Stories: ${result.stories.available}</li>
        <li>Events: ${result.events.available}</li>
      </ul>
    </section>
  </div>
  `
  $('.character-bio').html(charHTML);
}

function selectMovie() {
  $('.movie-list').on('click','.moviePoster', event => {
    const movieID = $(event.currentTarget).attr('id');
    getCharacterData(movieID,getCharacters);
  });
}

function selectCharacter() {
  $('.character-list').on('click','.character-img', event => {
    const charID = $(event.currentTarget).attr('id');
    getCharacterDataByID(charID,renderCharacterBio);
  })
}


function renderPage() {
  getMarvelMovieData(marvelMovieData);
  selectMovie();
  selectCharacter();
}

$(renderPage);
