const express = require('express');
const questions = require('./routes/questions.js');
const defaultR = require('./routes/default.js');
const { uuidv4 } = require('./utils.js')
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const Config = require('./libs/config.js');

const helmet = require('helmet');

const session = require('express-session');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors());
app.use(helmet());


//================= Social Auth
const passport = require('passport');
require('./libs/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

//============== Routing

require('./routes')(app, passport);
defaultR.defaultRoutes(app);
questions.routes(app);



// SOCKETS

const publicPath = path.join(__dirname, '/../public');
const port = Config.port;
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


//================= Session
const sessionStore = require('./libs/sessionStore');
app.use(session({
    secret: Config.session.secret,
    key: Config.session.key,
    cookie: Config.session.cookie,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));


