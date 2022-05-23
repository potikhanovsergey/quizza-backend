const { addNewQuestion } = require("../controllers/questions.js");

const routes = (app) => {
  app.route('/questions')
  .get((req, res) => {
    res.send('GET request')
  })
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
