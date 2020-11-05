const fetch = require('node-fetch');
const cheerio = require('cheerio')

const url = 'https://www.imdb.com/find?q=';



function searchMovies(searchTerm) {
  return fetch(`${url}${searchTerm}`)
    .then(response =>
      response.text()) //html body
    .then(body => { console.log(body) })

}

searchMovies('star-wars')
  .then(body => {
    console.log(body)
  })