// ==== variables ====

const movieInput = document.getElementById("movie-input")
const moviesList = document.getElementById("movies-section")
const watchlistMessage = document.getElementById("watchlist-m")
const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myMovies"))
let myMovies = []


// ==== event listeners ====

/* button event listeners */
document.addEventListener("click", (e) => {
    if (e.target.dataset.add) {
        addMovie(e.target.dataset.add)
    }
}) 

/* form functionality */
document.addEventListener("submit", async (e) => {
    e.preventDefault()
    // requesting data from the OMDB api

    const res = await fetch(`https://www.omdbapi.com/?apikey=b6f96693&s=${movieInput.value}`)
    const data = await res.json()

    if (data.Response === "False") {
        renderErrorMessage(moviesList)
    } else {
        renderMoviesHtml(data)
    }
})


// ==== functions ====

/* saves to local storage */
function saveToLocalStorage(data) {
    localStorage.setItem("myMovies", JSON.stringify(data))
}


function renderWatchlistMessage() {
    watchlistMessage.classList.remove("hidden")

    setTimeout(() => {
        watchlistMessage.classList.add("hidden")
    }, 1500)
}


/* getting rid of duplicates in the array */
function deleteDuplicates(array) {
    
    const filteredArray = array.reduce((finalArray, currentMovie) => {
        let movieObj = finalArray.find(movie => movie.Title === currentMovie.Title)

        if (movieObj) { // if there are two same Titles
            return finalArray
        } else {       // if there are no two identical movie Titles
            return finalArray.concat([currentMovie])
        }
    }, [])

    return filteredArray
}

/* renders error message */
function renderErrorMessage(container) {
    container.innerHTML = `<h3 class="error-text">Unable to find what you are looking for. Please try another search.</h3>`
}

/* renders the movies into the document */
function renderMoviesHtml(movieData) {
    moviesList.innerHTML = ""

    movieData.Search.forEach(async obj => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=b6f96693&t=${obj.Title}`)
        const data = await res.json()

        // !! data.Ratings[0].Value can cause errors in the console since some movies have no ratings or non-existen

       moviesList.innerHTML += 
        `
        <div class="movie">
            <div class="movie-img">
                <img src="${data.Poster}" alt="">
            </div>
            <div class="movie-info">
                <div class="details details-1" id="title-and-rating">
                    <h2 class="title">${data.Title}</h3>
                    <div class="r-score">
                        <i class="fa-solid fa-star"></i>
                        <p class="rating">${data.Ratings[0].Value}</p> 
                    </div>
                    <div class="message-contaier" id="watchlist-message">
                    </div>
                </div>
                <div class="details details-2">
                    <p class="duration">${data.Runtime}</p>
                    <p class="genre">${data.Genre}</p>
                    <button class="watchlist-btn" data-add="${data.imdbID}">
                        <i class="fa-solid fa-circle-plus" data-add="${data.imdbID}"></i>
                        <p data-add="${data.imdbID}">watchlist</p>
                    </button>
                </div>
                <div class="details details-3">
                    ${data.Plot}
                </div>
            </div>
        </div>
        `
     })
}

/* adds movie to an array then into the local storage */
async function addMovie(id) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=b6f96693&i=${id}`)
    const data = await res.json()

    if (moviesFromLocalStorage) {
        myMovies = moviesFromLocalStorage
    }

    myMovies.push(data)

    const moviesData = deleteDuplicates(myMovies)

    saveToLocalStorage(moviesData)

    /* renders message */
    renderWatchlistMessage()
}
