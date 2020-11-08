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


const searchCache = {}
const movieCache = {}



const searchCache = {};

function searchMovies(searchTerm) {

  if (searchCache[searchTerm]) {
    return Promise.resolve(searchCache[searchTerm])
  }


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

  if (movieCache[imdbID]) {
    console.log('Serving from cache:', imdbID);
    return Promise.resolve(movieCache[imdbID])
  }


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


      const genres = []  //genre為多個 a 標籤u
      $('.subtext a').each(function (i, ele) {
        const genre = $(ele).text().trim()
        genres.push(genre)
      })
      const datePublished = genres[3]

      genres.splice(-1, 1) //remove last element
      const poster = $('div .poster a img').attr('src')

      const summary = $('div.summary_text').text().trim();


      const directors = []
      $('.credit_summary_item').first().find('a').each(function (i, ele) {
        const director = $(ele).text().trim()
        directors.push(director)
      })  //might have 2 directors

      const writers = []
      $('.credit_summary_item').eq(1).find('a').each(function (i, ele) {
        const writer = $(ele).text().trim()
        writers.push(writer)
      })
      writers.splice(-1, 1)

      const stars = [];
      $('.credit_summary_item').eq(2).find('a').each(function (i, ele) {
        const star = $(ele).text().trim()
        stars.push(star)
      })
      stars.splice(-1, 1)

      const storyLine = $('.canwrap').first().text().trim()

      const trailer = $('.slate').find('a').attr('href');


      const movie = {
        imdbID,
        title,
        rating,
        runTime,
        genres,
        poster,
        datePublished,
        summary,
        directors,
        writers,
        stars,
        storyLine,
        trailer: `https://www.imdb.com${trailer}`
      };

      console.log(movie)
      movieCache[imdbID] = movie

      return movie;
    });
}




module.exports = {
  searchMovies,
  getMovie
};


