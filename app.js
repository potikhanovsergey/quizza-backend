import express from 'express';
import routes from './routes/questions.js';
import mongoose from 'mongoose';
import defaultRoutes from './routes/default.js';

const app = express();
const PORT = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json())

defaultRoutes(app);
routes(app);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/quizzadb', {
  useNewUrlParser: true,
  useUnifiedTopology: false
})

app.get('/', (req, res) => {
  res.send('Node and express server');
})

app.listen(PORT);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

