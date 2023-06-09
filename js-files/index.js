const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input");

const moviesEl = document.getElementById('movies-el')


// handel all the "click" event
document.addEventListener('click', (e) => {
    if (e.target.id === "search-btn") {
        imdbIdFromAPI()
        reset()
    } else if (e.target.classList.contains('fa-plus')) {
        addMovieToWatchlist(e)

    } else if (e.target.classList.contains('fa-minus')) {
        removeMovieFromWatchlist(e)
    }
})

function addMovieToWatchlist(e) {
    const imdbID = e.target.dataset.dataid
    saveMovieToWatchlist(imdbID)

    // Update the text content of the specific watch status element
    e.target.parentNode.nextElementSibling.textContent = "Remove";
}

function removeMovieFromWatchlist(e) {
    const imdbID = e.target.dataset.dataid
    removeMovie(imdbID)

    // Update the text content of the specific watch status element
    e.target.parentNode.nextElementSibling.textContent = "Watchlist";
}

countMoviesInWatchlist()

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
                renderMovie(id.imdbID) //calling renderMovie() with imdbID's
            }
        } else {
            // movie not found message!!
            const errorMessage = `Unable to find what you’re looking for. Please try another search.`
            const errorMessageEl = `
                    <div class="default">
                        <p class="error-message-not-find-movie">
                            ${errorMessage}
                        </p>
                    </div>
                `
            moviesEl.innerHTML = errorMessageEl
        }
    } else { return null }
}

// 2 getting details of those movies with "i" query, and "imdbID"
async function getMovieById(movieId) {
    const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    const movieData = await res.json()
    return movieData
}

// render movie to the DOM from imdbAPI
function renderMovie(movie) {
    getMovieById(movie)
        .then(movieData => {

            const watchlist = JSON.parse(localStorage.getItem('watchlist'))
            const existingMovie = watchlist.find(movie => movie.movieData.imdbID === movieData.imdbID)
            const favorite = existingMovie ? existingMovie.movieData.favorite : false;

            const theMovie = new Movies(Object.assign(movieData, { favorite }));
            moviesEl.innerHTML += theMovie.getMoviesFromAPI()
        })
        .catch(err => console.log(err));
}

/* for watchlish */
function saveMovieToWatchlist(imdbID) {
    getMovieById(imdbID)
        .then(movieData => {
            // 
            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

            // Check if the movie already exists in the watchlist
            const existingMovie = watchlist.find(movie => movie.movieData.imdbID === imdbID);
            if (existingMovie) {
                const newMovie = new Movies(movieData);
                newMovie.favorite = false;
                console.log('Item already exists');
            } else {
                const newMovie = new Movies(movieData);
                newMovie.favorite = true; // Set favorite to false for newly added movie
                watchlist.push({ movieData: newMovie });
                console.log('Item added to watchlist');
            }
            localStorage.setItem('watchlist', JSON.stringify(watchlist));

            renderWatchlist();

            // it's update the icon from renderMovie list to the DOM!
            const renderedMovie = document.querySelector(`[data-dataid="${imdbID}"]`);
            if (renderedMovie) {
                renderedMovie.classList.add("fa-minus");
                renderedMovie.classList.remove("fa-plus");
            }
        })
        .catch(err => console.error(err));
}

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"));

    // Clear the existing text content of the temporary element
    document.getElementById('temporary').textContent = ""

    for (let i = 0; i < watchlist.length; i++) {
        let wi = watchlist[i].movieData;
        // console.log(wi);

        const theMovie = new Movies(wi);
        const showMovieToDOM = theMovie.getMoviesFromAPI();
        document.getElementById('temporary').innerHTML += showMovieToDOM;
    }
    countMoviesInWatchlist()
}

// localStorage.clear()

function removeMovie(imdbID) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))

    // Find the movie in the watchlist by its imdbID (index number)
    const index = watchlist.findIndex(movie => movie.movieData.imdbID === imdbID);
    console.log(index)

    // remove movie from watchlist 
    watchlist.splice(index, 1);

    // Save the watchlist data to localStorage
    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    // Update the DOM
    renderWatchlist();


    // it's update the icon from renderMovie list to the DOM!
    const renderedMovie = document.querySelector(`[data-dataid="${imdbID}"]`);
    if (renderedMovie) {
        // console.log(renderMovie)
        renderedMovie.classList.add("fa-plus");
        // renderedMovie.classList.remove("red");
        renderedMovie.classList.remove("fa-minus");
    }
}

function countMoviesInWatchlist() {
    // Get the watchlist data from localStorage
    const watchlist = JSON.parse(localStorage.getItem("watchlist"));

    // count the number of movies in the watchlist
    let count = 0;
    for (let i = 0; i < watchlist.length; i++) {
        count++
    }

    // save count to the localStorage, &  getting it by "getWatchlistCount"
    localStorage.setItem("count", JSON.stringify(count));
    let getWatchlistCount = JSON.parse(localStorage.getItem("count"))

    // updating the DOM with movie in the watchlist AKA count
    document.querySelector(".watchlist-count").textContent = getWatchlistCount

    console.log(getWatchlistCount)
}

function reset() {
    moviesEl.innerHTML = ""
}

/*======================
        JS Class        
    ======================*/
class Movies {
    constructor(data) {
        Object.assign(this, data)
        this.favorite = data.favorite ? true : false;
    }

    getMoviesFromAPI() {
        const { Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID, favorite } = this;
        const favIcon = favorite
            ? ` <button class="btn watchlist-btn">
                    <i class="watch-status-btn fa-solid fa-minus" data-dataid="${imdbID}"></i>
                </button> 
                <i class="watch-status" id="remove" data-watch="${imdbID}">Remove</i>
              `
            : ` <button class="btn watchlist-btn">
                    <i class="watch-status-btn fa-solid fa-plus" data-dataid="${imdbID}"></i>
                </button> 
                <i class="watch-status watch" id="watch">Watchlist</i>
              `;

        return `
                <div class="grid-container">
                    <img class="movie-poster" src="${Poster}" alt="${Title}">
                
                    <div class="first-row">
                        <h2>${Title}</h2>
                        <i class="fa-solid fa-star"><p> ${imdbRating}</p> </i>
                    </div>
                
                    <div class="second-row">
                        <p class="Runtime">${Runtime}</p>
                        <p class="movie-Genre">${Genre}</p>

                        <p class="watchList">
                            ${favIcon}
                        </p>
                    </div>

                    <p class="movie-plot">
                        ${Plot}
                    </p>
                </div>
            `;
    }
}      