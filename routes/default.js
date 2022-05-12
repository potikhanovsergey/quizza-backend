import { getQuestions } from "../controllers/default.js";

const defaultRoutes = (app) => {
  app.route('/default')
  .get(getQuestions)
}

export default defaultRoutes;