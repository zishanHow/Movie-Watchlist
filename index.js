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
    } else { return null }
}

// 2 getting details of those movies with "i" query, and "imdbID"
async function getMovieById(movieId) {
    const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    const movieData = await res.json()
    return movieData
}

function renderMovie(movie) {
    // calling the getMovieById() with argument for movies
    getMovieById(movie)
        .then(movieData => {
            const theMovie = new Moveis(movieData)
            const showMovieToDOM = theMovie.getMoviesFromAPI()
            document.getElementById('movies-el').innerHTML += showMovieToDOM
        })
        .catch(err => console.log(err))
}

/* for watchlish */
function saveMovieToWatchlist(imdbID) {
    getMovieById(imdbID)
        // Promise callback
        .then(movieData => {
            // const { Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID } = movieData
            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

            if (watchlist.some(movie => movie.movieData.imdbID === imdbID)) { 
                console.log("Item already exists")
                return 
            }

            // watchlist.push({ Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID });
            watchlist.push({ movieData });

            localStorage.setItem('watchlist', JSON.stringify(watchlist));

            renderWatchlist()
        })
        .catch(err => console.error(err));
}

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []


    if(watchlist.length === 0){
        console.log("Watchlist is empty")
        return
    }

    document.getElementById('temporary').innerHTML = "" // Clear existing content(for overwriting)

    for (let i = 0; i < watchlist.length; i++) {
        let wi = watchlist[i].movieData
        console.log(wi)

        const theMovie = new Moveis(wi)
        const showMovieToDOM = theMovie.getMoviesFromAPI()
        document.getElementById('temporary').innerHTML += showMovieToDOM
    }
    /* if (watchlist.some(movie => movie.imdbID === "imdbID")) {
        console.log("Item already exist")
    } else {
        // the for loop was here!!
    } */
}

    // localStorage.clear()

function reset() {
    document.getElementById('movies-el').innerHTML = ""
}

/*======================
        JS Class        
    ======================*/
class Moveis {
    constructor(data) {
        Object.assign(this, data)
    }

    getMoviesFromAPI() {
        const { Title, Poster, imdbRating, Runtime, Genre, Plot, imdbID } = this
        return `
            <div class="grid-container">
                <img class="movie-poster" src="${Poster}" alt="${Title}">
            
                <h2 class="movie-title">${Title}</h2>
                <i class="fa-solid fa-star"> ${imdbRating}</i>
            
                <p class="Runtime">${Runtime}</p>
                <p class="movie-Genre">${Genre}</p>
                <!-- <button class="watchList btn"><i class="fa-solid fa-plus"></i></button> -->
                <p class="watchList">Watchlist
                    <button class="watchlist-btn">
                        <i class="fa-solid fa-plus" id="fa-plus" data-dataid="${imdbID}"></i>
                    </button>
                </p>
                <p class="movie-plot">
                    ${Plot}
                </p>
            </div>
        `
    }
}
/*======================
        End JS Class
    ======================*/
    // let data = localStorage.getItem("watchlist")
    // console.log(data)



// async function imdbMovieFrmAPI(movieI) {
//     const res = await fetch(`https://www.omdbapi.com/?i=${movieI}&apikey=${apiKey}`)
//     const movieData = await res.json()
//     // renderMovie(movieData)
//     return movieData
// }    