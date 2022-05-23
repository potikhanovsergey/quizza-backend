const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: "Enter the question title"
  },
  answer: {
    type: String,
    required: "Enter the right answer"
  },
  fakeAnswers: {
    required: "Enter the array of three fake answers",
    type: [String],
    validate: (arr) => {
      return (arr.length === 3);
    },
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
    type: String
  }
})

module.exports = {
  QuestionSchema
}