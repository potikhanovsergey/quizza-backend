const mongoose = require("mongoose");

const { QuestionSchema } = require('../models/questions.js');

const Question = mongoose.model('Questions', QuestionSchema);

const addNewQuestion = (req, res) => {
  let newQuestion = new Question(req.body);
  newQuestion.save((err, question) => {
    if (err) {
      res.send(err);
    }

    res.json(question);
  })
}

const getQuestions = async (req, res) => {
  // Кидает рандомные вопросы из модели Question (rounds - колво, по дефолту 5, можно поменять в запросе)
  // Пример запроса: http://localhost:3000/default?rounds=2
  let rounds = +req?.query?.rounds || 5;
  let questions = await Question.aggregate([{ $sample: { size: rounds } }]); 
  res?.send(questions);
  return questions;
}

module.exports = {
  addNewQuestion,
  getQuestions
}