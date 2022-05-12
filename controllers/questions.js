import mongoose from "mongoose";

import { QuestionSchema } from "../models/questions.js";

const Question = mongoose.model('Questions', QuestionSchema);

export const addNewQuestion = (req, res) => {
  let newQuestion = new Question(req.body);
  newQuestion.save((err, question) => {
    if (err) {
      res.send(err);
    }

    res.json(question);
  })
}