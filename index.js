const btn = document.getElementById('search-btn')

const apiKey = "cdf764e"
const searchInputEl = document.getElementById("search-input")



btn.addEventListener('click', () => {
    // e.preventDefault()
    console.log("Button Clicked")

    fetch(`https://www.omdbapi.com/?s=${searchInputEl.value}&apikey=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let mainHtml = ``
            // for(let item of data){
            //     console.log(item)
            // }

            // document.getElementById('main').innerHTML = mainHtml
        })
})



