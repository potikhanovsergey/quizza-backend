import mongoose from "mongoose";

import { QuestionSchema } from "../models/questions.js";

const Question = mongoose.model('Questions', QuestionSchema);

export const getQuestions = async (req, res) => {
  let rounds = +req.query.rounds || 5;
  let questions = await Question.aggregate([{ $sample: { size: rounds } }]);
  res.send(questions);
}