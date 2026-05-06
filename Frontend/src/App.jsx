
import { io } from "socket.io-client";

import { useState, useMemo, useEffect } from "react";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';


function App() {

  const socket = useMemo(() => io('http://localhost:8080'), []);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState('');

  const [socketId, setSocketId] = useState('');

  const [room, setRoom] = useState('');

  const [roomName, setRoomName] = useState('');


  const formHandler = (e) => {

    e.preventDefault();

    socket.emit('message', { message, room });

    setMessage('');
  }

  const roomForm = (e) => {

    e.preventDefault();

    socket.emit('join-room', roomName);

    setRoomName('');
  }

  useEffect(() => {

    socket.on('connect', () => {

      setSocketId(socket.id);

      console.log('User connected -', socket.id);
    });


    socket.on('receive-message', (m) => {

      setMessages((messages) => [...messages, m]);
    })

    return () => {

      socket.disconnect();
    }

  }, []);

  return (

    <>
      <Container maxWidth="sm" style={{ marginTop: "80px" }}>

        <Typography variant="h4" component='div'>

          Welcome -{socketId}
        </Typography>

        <br />

        <form onSubmit={roomForm}>

          <Typography variant="h4" component='div'>

            <TextField id="outlined-basic" label="Room Name" variant="outlined" value={roomName} onChange={(e) => setRoomName(e.target.value)} />

            &nbsp;
            <Button variant="contained" type="submit">Join</Button>
          </Typography>

        </form>

        <br />

        <form onSubmit={formHandler}>

          <Typography variant="h4" component='div'>

            <TextField id="outlined-basic" label="Message" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} />


            <TextField id="outlined-basic" label="Room" variant="outlined" value={room} onChange={(e) => setRoom(e.target.value)} />

            <br />
            <Button variant="contained" type="submit">Send</Button>

          </Typography>

        </form>

        <Stack>

          {

            messages.map((m, i) => (

              <Typography variant="h5" component='div' key={i}>

                {m}

              </Typography>
            ))
          }

        </Stack>

      </Container>


    </>
  )

}

export default App;
