const express = require('express')
const scraper = require('./scraper')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

//database connection
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

app.use(cors()) //allow跨網域權限
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

      console.log('post activated!')
      Movie.findOne({ imdbID: movie.imdbID }).then(id => {
        if (id) {
          console.log('movie already exist!')
          return res.json({ status: 'error', message: 'movie already exist!' })
        } else {
          return Movie.create({
            imdbID: movie.imdbID,
            title: movie.title,
            rating: movie.rating,
            genres: movie.genres,
            datePublished: movie.datePublished
          }).then(user => {
            return res.status(200).send('database updated!')
          })
            .catch(error => res.send(String(error)))
        }
      })
    })

})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen on ${port}`)
}

)




// User.findOne({ where: { $or: [{ email: req.body.email }, { account: req.body.account }] } })
//   .then(user => {
//     if (user) {
//       if (user.email === req.body.email) {
//         return res.json({ status: 'error', message: 'Email has been registered.' })
//       } else if (user.account === req.body.account) {
//         return res.json({ status: 'error', message: 'Already have the same account.' })
//       }
//     } else {
//       return User.create({
//         name: req.body.name,
//         account: req.body.account,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
//         role: 'user'
//       })
//     }
//   })
//   .then(user => {
//     return res.json({ status: 'success', message: 'Registration success.' })
//   })
//   .catch(error => res.send(String(error)))
//   },
