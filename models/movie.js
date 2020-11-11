
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
  imdbID: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('movie', movieSchema)

