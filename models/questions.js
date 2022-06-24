const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: "Enter the question title"
  },
  answers: {
    type: [String],
    required: "Enter the list of answers"
  },
  rightAnswerID: {
    type: Number,
    required: "Enter the right answer ID (0-3)"
  },
  image: {
    required: false,
    url: {
      type: String,
      default: "path/to/placeholder/should/be/here"
    },
    alt: {
      type: String,
      default: "Quizza Game"
    }
  },
  category: {
    type: String,
    required: false
  }
})

module.exports = {
  QuestionSchema
}