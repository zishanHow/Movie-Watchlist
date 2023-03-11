const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")



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
    
    
    
