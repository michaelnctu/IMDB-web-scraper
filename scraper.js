
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { response } = require('express');

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/'


const searchCache = {}
const movieCache = {}

//將跑出搜尋結果
function searchMovies(searchTerm) {
  //如果cache有資料則不用fetch
  if (searchCache[searchTerm]) {
    console.log('Serving from cache:', searchTerm);
    return Promise.resolve(searchCache[searchTerm]);
  } //檢查我的movieCache內有沒有imdbID的資料,有的話直接顯示,沒有就重新fetch資料

  return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function (i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');
        const imdbID = ($title.attr('href').match(/title\/(.*)\//) || [])[1]; //regular expression 若比對成功返回id

        const movie = {
          image: $image.attr('src'),
          title: $title.text(),
          imdbID
        };
        movies.push(movie);
      });

      searchCache[searchTerm] = movies;

      return movies;
    });
}

//將得到單個movie資訊
function getMovie(imdbID) {

  if (movieCache[imdbID]) {
    console.log('Serving from cache:', imdbID);
    return Promise.resolve(movieCache[imdbID])
  }  //檢查我的movieCache內有沒有imdbID的資料,有的話直接顯示,沒有就重新fetch資料

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


