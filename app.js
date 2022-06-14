const express = require('express');
const questions = require('./routes/questions.js');
const mongoose = require('mongoose');
const defaultR = require('./routes/default.js');
const { uuidv4 } = require('./utils.js')
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { getQuestions } = require("./controllers/questions.js");


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors());

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
let httpServer = http.createServer(app);

const io = new socketIO.Server(httpServer, {
  cors: {
    origin: "*"
  }
});

app.use(express.static(publicPath));

httpServer.listen(port, ()=> {
  console.log(`Server is up on port ${port}.`)
});

const RoomUserSocket = {}; // {roomID: userID: socket}
let userID = 0;

io.on('connection', async (client) => {
  // Получает параметры, переданные от клиента сокета
  console.log(client.id, 'has connected')
  client.on('joinGameRoom', async (data) => {
    console.log('Client has tried to join the room', data);
    const { userID, roomID } = data;
    let roomClients = await io.sockets.adapter.rooms.get(roomID);
    if (!roomClients) {
      RoomUserSocket[roomID] = {};
    }
    // Присваиваем айдишнику пользователя вошедшего в комнату его текущий сокет
    RoomUserSocket[roomID][userID] = client; 

    // const usersLength = Object.keys(RoomUserSocket[roomID]).length;
    // если меньше двух уникальных пользователей, можно присоединиться в комнату
    if (!roomClients || (roomClients && roomClients.size < 2)) { 
      client.join(roomID);
      roomClients = await io.sockets.adapter.rooms.get(roomID);
      console.log('Client has joined the room', data, roomClients);
    }

    // если два участника в комнате
    if (roomClients && roomClients.size === 2) {
      const questions = await getQuestions();
      io.to(roomID).emit('startGame', { roomID: roomID, questions })
    }
  });


  userID++;
  io.to(client.id).emit('sendID', {userID})


});
