const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")

// handel all the "click" event
document.addEventListener('click', (e) => {
    if (e.target.id === "search-btn") {
        imdbIdFromAPI()
        reset()
        // fun()
    } else if (e.target.dataset.dataid) {
        // console.log(e.target.dataset.dataid)
        const imdbID = e.target.dataset.dataid
        saveMovieToWatchlist(imdbID)
    }
})

// OMDb API=>(getting movies from it) [cmt=> 1, and 2.]
// 1 getting multiple movie data with "s" query(mainly "imdbID")
async function imdbIdFromAPI() {
    const searchMovie = searchInputEl.value.trim()
    const res = await fetch(`https://www.omdbapi.com/?s=${searchMovie}&apikey=${apiKey}`)
    const data = await res.json()

    if (data.Response) {
        if (data.Search) {
            // looping the Search result for every "imdbID"
            for (let id of data.Search) {
                // calling render movie function here with argument.
                renderMovie(id.imdbID)
            }
        } else {
            console.log("put something")
        }
    } else { return null, "API request failed" }
}

// 2 getting details of those movies with "i" query, and "imdbID"
async function getMovieById(movieId) {
    const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    const movieData = await res.json()
    return movieData
}

// Render a movie by imdbID
function renderMovie(movie) {
    getMovieById(movie)
      .then(movieData => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
        const existingMovie = watchlist.find(item => item.movieData.imdbID === movieData.imdbID);
        movieData.favorite = existingMovie ? existingMovie.movieData.favorite : false;
  
        const theMovie = new Movies(movieData);
        const showMovieToDOM = theMovie.getMoviesFromAPI();
        document.getElementById('movies-el').innerHTML += showMovieToDOM;
      })
      .catch(err => console.log(err));
  }
  
  
//   localStorage.clear()
  


/* for watchlish */
function saveMovieToWatchlist(imdbID) {
    getMovieById(imdbID)
      .then(movieData => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const existingMovie = watchlist.find(movie => movie.movieData.imdbID === imdbID);
  
        if (existingMovie) {
          existingMovie.movieData.favorite = true;
          console.log('Item already exists');
        } else {
          movieData.favorite = true;
          watchlist.push({ movieData: movieData });
          console.log('Item added to watchlist');
        }
  
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
  
        // Update the favorite icon for the rendered movie if it matches the added movie
        const renderedMovie = document.querySelector(`[data-dataid="${imdbID}"]`);
        if (renderedMovie) {
          renderedMovie.classList.add("fa-minus");
          renderedMovie.classList.remove("fa-plus");
        }
      })
      .catch(err => console.error(err));
  }
  







function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (watchlist.length === 0) {
        console.log("Watchlist is empty");
        return;
    }

    const watchlistContainer = document.getElementById('temporary');
    watchlistContainer.innerHTML = ""; // Clear existing content (for overwriting)

    for (let i = 0; i < watchlist.length; i++) {
        let wi = watchlist[i].movieData;
        console.log(wi);

        const theMovie = new Movies(wi);
        const showMovieToDOM = theMovie.getMoviesFromAPI();
        document.getElementById('temporary').innerHTML += showMovieToDOM;
    }
}



function reset() {
    document.getElementById('movies-el').innerHTML = ""
}



function toggleFavorite() {

}




/*======================
        JS Class        
    ======================*/
class Movies {
    constructor(data) {
        Object.assign(this, data);
        this.favorite = data.favorite ? true : false;
    }

    getMoviesFromAPI() {
        const { Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID, favorite } = this;
      
        const favoriteIcon = favorite
          ? `<i class="fa-solid fa-minus" data-dataid="${imdbID}"></i>`
          : `<i class="fa-solid fa-plus" data-dataid="${imdbID}"></i>`;
      
        return `
          <div class="grid-container">
            <img class="movie-poster" src="${Poster}" alt="${Title}">
          
            <h2 class="movie-title">${Title}</h2>
            <i class="fa-solid fa-star"> ${imdbRating}</i>
          
            <p class="Runtime">${Runtime}</p>
            <p class="movie-Genre">${Genre}</p>
            <p class="watchList">Watchlist
              <button class="watchlist-btn">
                ${favoriteIcon}
              </button>
            </p>
            <p class="movie-plot">
              ${Plot}
            </p>
          </div>
        `;
      }               


    makeFavorite() {
        this.favorite = true;
    }

    dislike() {
        this.favorite = false;
    }
}

/*======================
        End JS Class
    ======================*/