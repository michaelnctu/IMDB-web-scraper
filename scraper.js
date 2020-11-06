//=>  <ul id="fruits">
//      <li class="apple">Apple</li>
//      <li class="orange">Orange</li>
//      <li class="pear">Pear</li>
//    </ul>


const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { response } = require('express');

const searchUrl = 'https://www.imdb.com/find?q=';
const movieUrl = 'https://www.imdb.com/title/'





const searchCache = {};

function searchMovies(searchTerm) {
  return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function (i, element) { //findResult為imdb標籤 each為cheerio語法 會遍歷每一個find result
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');

        const imdbID = $title.attr('href').match(/title\/(.*)\//)[1]; //regular expression

        const movie = {
          image: $image.attr('src'), //.attr( name, value )  這邊解除src
          title: $title.text(),
          imdbID
        };
        movies.push(movie);
      });

      return movies;
    });
}

function getMovie(imdbID) {


  return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      const $title = $('.title_wrapper h1');

      const title = $title.first().contents().filter(function () {  //first()第一個元素
        return this.type === 'text';
      }).text().trim();
      const rating = $('span[itemprop="ratingValue"]').text();
      const runTime = $('time').first().contents().text().trim()


      const genres = []  //genre為多個 a 標籤
      $('.subtext a').each(function (i, ele) {
        const genre = $(ele).text()
        genres.push(genre)
      })
      genres.splice(-1, 1) //remove last element

      const poster = $('div .poster a img').attr('src')



      const movie = {
        imdbID,
        title,
        rating,
        runTime,
        genres,
        poster
        // datePublished,
        // imdbRating,
        // poster,
        // summary,
        // directors,
        // writers,
        // stars,
        // storyLine,
        // companies,
        // trailer: `https://www.imdb.com${trailer}`
      };

      // movieCache[imdbID] = movie;

      console.log(movie)

      return movie;
    });
}




module.exports = {
  searchMovies,
  getMovie
};


