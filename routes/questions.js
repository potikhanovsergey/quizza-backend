const { addNewQuestion, getQuestions } = require("../controllers/questions.js");
const routes = (app) => {
  app.route('/questions')
  .get(getQuestions)
  .post(addNewQuestion)

  app.route('/questions/:questionID')
  .put((req, res) => {
    res.send('PUT request')
  })
  .delete((req, res) => {
    res.send('DELETE request')
  })
}

module.exports = {
  routes
}

