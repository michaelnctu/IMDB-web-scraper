
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchUrl = 'https://www.imdb.com/find?q=';

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



module.exports = {
  searchMovies
};


