const express = require('express')
const cors = require('cors')
const scraper = require('./scraper')


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

})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen on ${port}`)
}

)