const { getQuestions } = require("../controllers/default.js");

const defaultRoutes = (app) => {
  app.route('/default')
  .get(getQuestions)
}

module.exports = {
  defaultRoutes
}
