const searchBtn = document.getElementById('search-btn')
const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")

// handel all the "click" event
document.addEventListener('click', (e) => {
    if (e.target.id === "search-btn") {
        searchMoviesByName()
        reset()
    } else if (e.target.id === "fa-plus") {
        console.log(e.target.dataset.dataid)
        // imdbMovieFrmAPI(e.target.dataset.dataid)
    }
})

// OMDb API=>(getting movies from it) [cmt=> 1, and 2.]
// 1 getting multiple movie data with "s" query(mainly "imdbID")
async function imdbIdFromAPI(movieName) {
    const res = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`)
    const data = await res.json()
    // calling the imdbMovieFrmAPI() with argument for movies
    if (data.Response) {
        // looping the Search result for every "imdbID"
        for (let id of data.Search) {
            imdbMovieFrmAPI(id.imdbID)
        }
    } else { return null }
}

// 2 getting details of those movies with "i" query, and "imdbID"
async function imdbMovieFrmAPI(movieI) {
    const res = await fetch(`https://www.omdbapi.com/?i=${movieI}&apikey=${apiKey}`)
    const movieData = await res.json()
    // console.log(movieData)
    renderMovie(movieData)
}

// getting movie name from search input.
function searchMoviesByName() {
    let name = (searchInputEl.value).trim()
    imdbIdFromAPI(name)
}

function renderMovie(movie) {
    const theMovie = new Moveis(movie)
    let showMovieToDOM = theMovie.getMoviesFromAPI()
    document.getElementById('movies-el').innerHTML += showMovieToDOM
}

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