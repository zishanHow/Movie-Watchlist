const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")


// OMDb API=>(getting movies from it)
async function getMoviesFromAPI(movieName) {
    // 1 getting multiple movie data with "s" query(mainly "imdbID")
    const res = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`)
    const data = await res.json()

    if (data.Search) {
        // looping the Search result for "imdbID"
        for (let id of data.Search) {
            // 2 getting details of those movies with "i" query, and "imdbID"
            const res = await fetch(`https://www.omdbapi.com/?i=${id.imdbID}&apikey=${apiKey}`)
            const movieData = await res.json()
            console.log(movieData)
        }
    }
}

// getting movie name from search input.
function searchMoviesByName(name) {
    name = (searchInputEl.value).replace(/\s+/g, ' ')
    console.log(name)
    getMoviesFromAPI(name)
}

btn.addEventListener("click", () => {
    searchMoviesByName()
})


/* don't need it for time being(maybe not at all)

btn.addEventListener('click', async() => {
    console.log("Button Clicked")

    // getting multiple movie data with "s" query.
    const res = await fetch(`https://www.omdbapi.com/?s=${searchInputEl.value}&apikey=${apiKey}`)
    const data = await res.json()
    // console.log(data.Search)
    
    for(let item of data.Search){
        // console.log(item.imdbID)

        // getting details of those movies with "i" query.
        const res = await fetch(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=${apiKey}`)
        const imdbID = await res.json()
        console.log(imdbID)
    }
})
*/