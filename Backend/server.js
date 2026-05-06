require('dotenv').config();

const express = require('express');

const app = express();

const db_url = process.env.DB_URL;

const port = process.env.PORT || 8080;

const cors = require('cors');

const { Server } = require('socket.io');

const http = require('http');

const httpServer = http.createServer(app);

const mongoose = require('mongoose');

app.use(cors({

  origin: 'http://localhost:5173',

  methods: ['GET', 'POST']
}));

const io = new Server(httpServer, {

  cors: {

    origin: 'http://localhost:5173',

    methods: ["GET", 'POST']
  }
});


io.on('connection', (socket) => {

  console.log('User connected with', socket.id);

  socket.on('message', ({ message, room }) => {

    io.to(room).emit('receive-message', message);
  })

  socket.on('join-room', (room) => {

    socket.join(room);
  })

  socket.on('disconnect', () => {

    console.log(`User ${socket.id} has disconnected`);
  })
})


async function start() {

  try {

    await mongoose.connect(db_url);

    httpServer.listen(port, () => {

      console.log(`Server started on ${port}`);
    })

  } catch (error) {

    console.error('Something went wrong', error);
  }
}


start().then(() => {

  console.log('Connection Established with database');

}).catch((err) => {

  console.error('Error connecting to the DB');
})
