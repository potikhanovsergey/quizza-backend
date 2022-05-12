import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const QuestionSchema = new Schema({
  question: {
    type: String,
    required: "Enter question title"
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
    }
  },
  created_date: {
    type: Date,
    default: Date.now
  },
})