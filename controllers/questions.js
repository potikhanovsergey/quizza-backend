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

module.exports = {
  addNewQuestion
}