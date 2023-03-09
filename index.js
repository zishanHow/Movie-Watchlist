const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const movieInput = "star wars"



btn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("Button Clicked")
})



fetch(`https://www.omdbapi.com/?s=${movieInput}&apikey=${apiKey}`)
.then(res => res.json())
.then(data => {
    // console.log(data.Search)
    for(let item of data.Search){
        console.log(item)
    }
})
