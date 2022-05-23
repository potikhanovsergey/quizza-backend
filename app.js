const express = require('express');
const questions = require('./routes/questions.js');
const mongoose = require('mongoose');
const defaultR = require('./routes/default.js');
const { uuidv4 } = require('./utils.js')
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');




const app = express();
const PORT = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors());

defaultR.defaultRoutes(app);
questions.routes(app);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/quizzadb', {
  useNewUrlParser: true,
  useUnifiedTopology: false
})


// app.listen(PORT);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');


// SOCKETS

const publicPath = path.join(__dirname, '/../public');
console.log(publicPath);
const port = process.env.PORT || 3000;
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, ()=> {
  console.log(`Server is up on port ${port}.`)
});

io.on('connection', (socket) => {
  console.log('A user just connected.');
  socket.on('disconnect', () => {
      console.log('A user has disconnected.');
  })
  socket.on('startGame', () => {
    console.log('Game has been started')
  })
  socket.on('answerIsClicked', (answer) => {
    io.emit('answerIsClicked', answer);
  })
});
