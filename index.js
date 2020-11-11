const express = require('express')
const cors = require('cors')
const scraper = require('./scraper')

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/IMDB-Movie', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//mongoDB
const Movie = require('./models/movie')


const app = express()




app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
  res.json({
    message: 'hello aws'
  })
})

app.get('/search/:title', (req, res) => {
  scraper
    .searchMovies(req.params.title)
    .then(movies => {
      res.json(movies) //array
    })
})

app.get('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.json(movie)
    })
})

app.post('/movie/:imdbID', (req, res) => {

  scraper.getMovie(req.params.imdbID)
    .then(movie => {
      console.log('post!')
      console.log(movie)
      return Movie.create({
        imdbID: movie.imdbID,
        title: movie.title
      })
    })
    .then(user => {
      return res.json({ status: 'success', message: 'Registration success.' })
    })
    .catch(error => res.send(String(error)))


})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen on ${port}`)
}

)




