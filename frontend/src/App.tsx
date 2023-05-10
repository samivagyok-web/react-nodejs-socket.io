import React, { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NicknameDialog from './NicknameDialog';

interface User {
  id: string,
  name: string
}

interface MessageResponse {
  message: string,
  user: User
}

enum ChatActivityType {
  Message = 1,
  Info = 2
}

interface ChatActivity {
  sender: string,
  text: string,
  time: string,
  type: ChatActivityType
}

function App() {
  const [inputText, setInputText] = useState("");
  const [openDialog, setOpenDialog] = useState(true);
  const [user, setUser] = useState<User>({id: '', name: ''});

  const [messages, _setMessages] = useState<ChatActivity[]>([]);
  const messageRef = useRef(messages);
  const setMessages = (data: any) => {
    messageRef.current = data;
    _setMessages(data);
  }

  const [users, _setUsers] = useState<User[]>([]);
  const userRef = useRef(users);
  const setUsers = (data: any) => {
    userRef.current = data;
    _setUsers(data);
  }

  useEffect(() => {
    function onMessage(res: MessageResponse) {
      const tempMessages = [...messageRef.current];
      tempMessages.push({text: res.message, sender: res.user.name, time: "", type: ChatActivityType.Message});

      setMessages(tempMessages);
    }

    function onEnter(user: User) {
      const tempMessages = [...messageRef.current];
      tempMessages.push({text: `${user.name} has joined.`, sender: '', time: '', type: ChatActivityType.Info});

      const tempUsers = [...userRef.current];
      tempUsers.push(user);

      setMessages(tempMessages);
      setUsers(tempUsers);
    }

    function onConnect() {
      setUser({...user, id: socket.id})
    }

    function onDisconnect(id: string) {
      const user = userRef.current.find(p => p.id == id);

      const tempMessages = [...messageRef.current];
      tempMessages.push({sender: '', time: '', type: ChatActivityType.Info, text: `${user?.name} has left.`});

      setMessages(tempMessages);
      setUsers(userRef.current.filter(p => p.id != id));
    }

    socket.on('sendmessage', onMessage);
    socket.on('connected', onEnter);
    socket.on('connect', onConnect);
    socket.on('disconnected', onDisconnect);

    return () => {
      socket.off('sendmessage', onMessage);
      socket.off('connected', onEnter);
      socket.off('connect', onConnect);
      socket.off('disconnected', onDisconnect);
    };
  }, []);

  const sendMessage = () => {
    if (!inputText) {
      return;
    }

    socket.emit('sendmessage', {message: inputText, user: user});
    setInputText('')
  }

  const onEnter = () => {
    if (!user) {
      return;
    }

    socket.emit('connected', user);
    setOpenDialog(false);
  }

  const renderChatActivityBox = (activity: ChatActivity, idx: number) => {
    if (activity.type == ChatActivityType.Info) {
      return (
        <Typography key={idx} sx={{color: "gray", fontSize: 12, marginBottom: 1.5}}>{activity.text}</Typography>
      )
    }

    return (
      <Box sx={{marginBottom: 1.5}} key={idx}>
        <Typography sx={{color: "green", fontSize: 18, marginBottom: -0.5}}>{activity.sender}</Typography>
        <Typography sx={{color: "black", fontSize: 16}}>{activity.text}</Typography>
      </Box>      
    )
  }

  return (
    <Grid container style={{height: "94vh"}} columns={14} gap={1}>
      <NicknameDialog open={openDialog} setOpenDialog={onEnter} nickname={user.name} setNickname={(name: string) => {setUser({...user, name: name})}} />
      <Grid item md={5}>
        asd
      </Grid>

      <Grid item md={5}>
        asd
      </Grid>

      <Grid item md={3}>
        <Box sx={{border: "1px solid grey", height: "100%", borderRadius: 3, padding: 2}} display='flex' flexDirection='column'>
          <Box display='flex' flexDirection='column'>
            {messages.map((item, idx) => renderChatActivityBox(item, idx))}
          </Box>

          <Box marginTop='auto' display='flex' alignItems='center' gap={2}>
            <TextField variant='standard' value={inputText} onChange={(e) => {setInputText(e.currentTarget.value)}} onKeyUp={(e) => {if (e.key == 'Enter') {sendMessage()}}} />
            <IconButton onClick={sendMessage}>
              <SendIcon/>
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
