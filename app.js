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

require('dotenv').config()

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors());

// questions.routes(app);

// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/quizzadb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: false
// })

const uri = "mongodb+srv://quizza-user:XdSvJoxVSlVBcZer@quizzacluster.qcyt3.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || uri, {
  useNewUrlParser: true,
  useUnifiedTopology: false
})

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://quizza-user:<password>@quizzacluster.qcyt3.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// app.listen(PORT);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');


// SOCKETS

const publicPath = path.join(__dirname, '/../public');
console.log(publicPath);
const port = process.env.PORT || 443;
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

const RoomUser = {}; // {roomID: userID: socket}
let userID = 0;

io.on('connection', async (client) => {
  // Получает параметры, переданные от клиента сокета
  console.log(client.id, 'has connected');
  client.on('joinGameRoom', async (data) => {
    try {
      console.log('Client has tried to join the room', data);
      const { userID, roomID } = data;
      let roomClients = await io.sockets.adapter.rooms.get(roomID);
      if (!roomClients) {
        const questions = await getQuestions();
        RoomUser[roomID] = {
          step: 0,
          questions,
          timerCount: 60
        };
      }
  
      if (!RoomUser[roomID][userID]) {
        RoomUser[roomID][userID] = {
          selected: null
        };
      }
  
      // const usersLength = Object.keys(RoomUser[roomID]).length;
      // если меньше двух уникальных пользователей, можно присоединиться в комнату
      // if (!roomClients || (roomClients && roomClients.size < 2)) { 
      client.join(roomID);
      roomClients = await io.sockets.adapter.rooms.get(roomID);
      console.log('Client has joined the room', data, roomClients);
      // }
  
      // если два участника в комнате
      
      console.log(roomClients);
      if (roomClients && roomClients.size >= 2) {
        io.to(roomID).emit('startGame', { roomID });
  
        const otherID = Object.keys(RoomUser[roomID]).filter(key => {
          if (key !== userID && key.length > 16) {
            return true;
          }
        })[0];

        if (!RoomUser[roomID].timer) {
          RoomUser[roomID].timer = setInterval(() => {
            RoomUser[roomID].timerCount -= 1;
            io.to(roomID).emit('timerUpdate', { timer: RoomUser[roomID].timerCount });
            if (RoomUser[roomID].timerCount < 1) clearInterval(RoomUser[roomID].timer);
          }, 1000);
        }

        console.log('otherID >', otherID, RoomUser[roomID]);
        io.to(roomID).emit('pushGameInfo', { 
          roomID, 
          questions: RoomUser[roomID].questions,
          step: Math.floor(RoomUser[roomID].step),
          otherID
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  client.on('chooseAnswer', async (data) => {
    try {
      console.log('client chose answer >', data);
      const { roomID, answerID, userID, otherID } = data;
      if (!RoomUser?.[roomID]?.[userID]) {
        RoomUser[roomID][userID] = {
          selected: null
        };
      }
      RoomUser[roomID][userID].selected = answerID;
      RoomUser[roomID].step += 0.5;
      if (RoomUser[roomID].step === Math.floor(RoomUser[roomID].step)) {
        RoomUser[roomID].timerCount = 60;
      }
      if (RoomUser[roomID].step > questions.length - 1) clearInterval(RoomUser[roomID].timer);
      client.to(roomID).emit('otherPlayerChoseAnswer', { answerID });
    } catch (error) {
        console.log(error);
    }
  });

  userID++;
  io.to(client.id).emit('sendID', {userID})
});

app.get('/', function(req, res) {
  res.send('hello world');
});


module.exports = app;