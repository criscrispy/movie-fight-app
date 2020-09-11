// Rendering an instances of the autocomplete widget using createAutoComplete widget -- 
// In React -- This would have been like creating / rendering a autocomplete instance in index.js
//  by importing the autocomplete component from autocomplete.js

const autocompleteConfig = {
    renderOption: (movie) => {
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src= "${imgSRC}"/>
            ${movie.Title}(${movie.Year})
        `;

    },
    inputValue: (movie) => {
        return `${movie.Title} ${movie.Year}`;
    },

    async fetchData(searchTerm) {
        const response1 = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '207a71f1',
                s: searchTerm,
                page: 1,
            }
        });
        if (response1.data.Error) {
            return [];
        }
        const response2 = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '207a71f1',
                s: searchTerm,
                page: 2,

            }
        });
        if (response2.data.Error) {
            return [];
        }

        // console.log(response);
        // return response.data.Search;
        const allresponse = [...response1.data.Search, ...response2.data.Search]
        console.log(allresponse);
        return allresponse;
    }
};

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        // document.querySelector(".tutorial").style.display = "none";
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
})

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        // document.querySelector(".tutorial").style.display = "none";
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },

})

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '207a71f1',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    side === 'left' ? leftMovie = response.data : rightMovie = response.data;

    if (leftMovie && rightMovie) {
        runComparism();
    }
};

const runComparism = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')
        }
        else {
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
        }

    })
}

const movieTemplate = (movieDetail) => {
    console.log(movieDetail);
    // At the moment, it works mainly for movies; Box office and metascore are absent/ don't apply for series.
    const boxOfficeDollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt((movieDetail.imdbVotes).replace(/,/g, ""));


    //----------------------------------------------------//
    // Using reduce() to calculate total number of awards and nominations 
    //----------------------------------------------------//

    const awards = movieDetail.Awards.split(' ').reduce((total, currentElement) => {
        const value = parseInt(currentElement);

        if (isNaN(value)) {
            return total
        } else {
            return total = total + value;
        }
    }, 0)


    //----------------------------------------------------//
    // Using foreach() to calculate total number of awards and nominations
    //----------------------------------------------------//

    // let count = 0;
    /*     const awards = movieDetail.Awards.split(" ").forEach(element => {
        const value = parseInt(element);

        if (isNaN(value)) {
            return;
        } else {
            count = count + value;
        }
    });
    console.log(count); */

    console.log(boxOfficeDollars, metaScore, imdbRating, imdbVotes, awards);

    return `
        <article class="media">
            <figure class="media-left"> 
               <p class="image">
               <img src = "${movieDetail.Poster}"/>
               </p> 
            </figure> 
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>       
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${boxOfficeDollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}