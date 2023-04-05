const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")

// OMDb API=>(getting movies from it)
async function getDataFromAPI(movieName) {
    // 1 getting multiple movie data with "s" query(mainly "imdbID")
    const res = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`)
    const data = await res.json()

    if (data.Search) {
        // looping the Search result for "imdbID"
        for (let id of data.Search) {
            // 2 getting details of those movies with "i" query, and "imdbID"
            const res = await fetch(`https://www.omdbapi.com/?i=${id.imdbID}&apikey=${apiKey}`)
            const movieData = await res.json()
            // console.log(movieData)
            //calling render movie function with a argument. 
            renderMovie(movieData)
        }
    }
}

// getting movie name from search input.
function searchMoviesByName(name) {
    name = (searchInputEl.value).replace(/\s+/g, ' ')
    // console.log(name)
    getDataFromAPI(name)
}

btn.addEventListener("click", () => {
    searchMoviesByName()
    renderMovie()
})


class Moveis{
    constructor(data){
        Object.assign(this, data)
    }

    getMoviesFromAPI(){
        const {Title, Poster, Ratings, Runtime, Genre, Plot} = this
        // console.log(Title, Poster, Ratings[0].Value, Runtime, Genre, Plot)
        return `
            <div class="grid-container" id="grid-container">
                <img class="movie-poster" src="${Poster}" alt="">
            
                <h2 class="movie-title">${Title}</h2>
                <i class="fa-solid fa-star"> ${Ratings[0].Value}</i>
            
                <p class="Runtime">${Runtime}</p>
                <p class="movie-Genre">${Genre}</p>
                <!-- <button class="watchList btn"><i class="fa-solid fa-plus"></i></button> -->
                <p class="watchList">Watchlist
                    <button class="btn"><i class="fa-solid fa-plus"></i>
                    </button>
                </p>
                <p class="movie-plot">
                    ${Plot}
                </p>
            </div>
        `
    }
}

function renderMovie(movieData){
    const theMovie = new Moveis(movieData)
    let showMovieToDOM = theMovie.getMoviesFromAPI()
    document.getElementById('main').innerHTML += showMovieToDOM
}