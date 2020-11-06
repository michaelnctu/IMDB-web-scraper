const fetch = require('node-fetch');
const cheerio = require('cheerio')

const url = 'https://www.imdb.com/find?q=';



function searchMovies(searchTerm) {
  return fetch(`${url}${searchTerm}`)
    .then(response => response.text()) //Decode content encoding 回傳html
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function (i, element) {   //findResult為imdb標籤 each為cheerio語法 會遍歷每一個find result
        const $element = $(element);
        const $image = $element.find('td a img')
        const $title = $element.find('td.result_text a')
        const movie = {
          image: $image.attr('src'),  //.attr( name, value )  這邊解除src
          title: $title.text()
        }
        movies.push(movie)
      })
      return movies
    })

}

searchMovies('star-wars')
  .then(body => {
    const movies = [];
    const $ = cheerio.load(body);
    $('.findResult').each(function (i, element) {   //findResult為imdb標籤 each為cheerio語法
      const $element = $(element);
      const $image = $element.find('td a img')
      const $title = $element.find('td.result_text a')

      const href = $title.attr('href')


      const movie = {
        image: $image.attr('src'),
        title: $title.text()
      }
      movies.push(movie)
    })
    return movies
  })

module.exports = {
  searchMovies
}