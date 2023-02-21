// ==== variables ====

const moviesFromLocalStorage = JSON.parse(localStorage.getItem("myMovies"))
const watchListContainer = document.getElementById("wl-movies-section")


// ==== event listeners ====

document.addEventListener("click", (e) => {
    if (e.target.dataset.remove) {
        removeMovie(e.target.dataset.remove)
    }
})



// ==== functions ====

/* saves to local storage */
function saveToLocalStorage(data) {
    localStorage.setItem("myMovies", JSON.stringify(data))
}

/* returns an array without the selected movie */
function removeMovie(id) {
    moviesFromLocalStorage.forEach(movie => {
        if (movie.imdbID === id) {
            moviesFromLocalStorage.splice(moviesFromLocalStorage.indexOf(movie), 1)
        }

        saveToLocalStorage(moviesFromLocalStorage)
    })

    renderWatchlistHtml(moviesFromLocalStorage)

    if (moviesFromLocalStorage.length === 0) {
        watchListContainer.innerHTML += `
        <div class="explore">
            <h3>Your watchlist is looking a little empty....</h3>
            <a class="add-btn"><i class="fa-solid fa-circle-plus"></i> Let's add some movies!</a>
        </div>
        `
    }

}


function renderWatchlistHtml(data) {
    watchListContainer.innerHTML = ""

    data.forEach(obj => {
        watchListContainer.innerHTML += `
        <div class="movie">
            <div class="movie-img">
                <img src="${obj.Poster}" alt="">
            </div>
            <div class="movie-info">
                <div class="details details-1">
                    <h2 class="title">${obj.Title}</h3>
                    <div class="r-score">
                        <i class="fa-solid fa-star"></i>
                        <p class="rating">${obj.Ratings[0].Value}</p> 
                    </div>
                </div>
                <div class="details details-2">
                    <p class="duration">${obj.Runtime}</p>
                    <p class="genre">${obj.Genre}</p>
                    <button class="watchlist-btn" data-remove="${obj.imdbID}">
                        <i class="fa-solid fa-circle-minus" data-remove="${obj.imdbID}"></i>
                        <p data-remove="${obj.imdbID}">watchlist</p>
                    </button>
                </div>
                <div class="details details-3">
                    ${obj.Plot}
                </div>
            </div>
        </div>
        `
    })
}




/* rendering the watchlist */

if (moviesFromLocalStorage.length > 0) {
    renderWatchlistHtml(moviesFromLocalStorage)
}


