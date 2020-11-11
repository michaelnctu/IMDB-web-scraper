
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Movie', movieSchema)