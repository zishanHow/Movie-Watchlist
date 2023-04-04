const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")

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

// OMDb API=>(getting movies from it)
async function getMoviesFromAPI(movieName){

    // getting multiple movie data with "s" query(mainly "imdbID")
    const res = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`)
    const data = await res.json()
    
    // looping the Search result for "imdbID"
    for(let id of data.Search){

        // getting details of those movies with "i" query, and "imdbID"
        const res = await fetch(`https://www.omdbapi.com/?i=${id.imdbID}&apikey=${apiKey}`)
        const movieData = await res.json()
        console.log(movieData)
    }
}

getMoviesFromAPI('la la land')




btn.addEventListener("click", ()=> {
    searchChecking()
})

    
function searchChecking(){
    let trimChecking = searchInputEl.value
    
    console.log(trimChecking.replace(/\s+/g, ' '))
}