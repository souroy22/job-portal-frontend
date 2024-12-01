import { FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AXIOS from "../../configs/axios.confog";
import SendIcon from "@mui/icons-material/Send";

const socket: Socket = io(
  import.meta.env.VITE_HOST === "localhost"
    ? import.meta.env.VITE_LOCAL_BASE_URL
    : import.meta.env.VITE_PROD_BASE_URL
);

interface Message {
  sender: string;
  message: string;
  createdAt: string;
}

const Chat: FC<{ userId: string; otherUserId: string }> = ({
  userId,
  otherUserId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const onLoad = async () => {
    // Register the user with the server
    socket.emit("register", userId);

    // Listen for messages
    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch previous messages from the server
    const allMessages = await AXIOS.get(
      `/message/all?sender=${userId}&receiver=${otherUserId}`
    );
    setMessages(allMessages.data);
  };

  console.log("userId", userId);
  console.log("otherUserId", otherUserId);

  useEffect(() => {
    onLoad();
    return () => {
      socket.off("receive-message");
      socket.emit("receive-message");
    };
  }, [userId, otherUserId]);

  const handleSendMessage = async () => {
    const message = {
      sender: userId,
      receiver: otherUserId,
      message: newMessage,
    };

    // Emit the message to the server
    socket.emit("send-message", message);

    // Optional: Persist the message to the backend
    await AXIOS.post("/message/send", {
      ...message,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: message.sender,
        message: message.message,
        createdAt: new Date().toString(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "300px",
        bgcolor: "#FFF",
        color: "gray",
        zIndex: "999999 !important",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {messages?.length ? (
            messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    msg.sender === userId ? "flex-end" : "flex-start",
                }}
              >
                <ListItemText
                  primary={msg.message}
                  sx={{
                    textAlign: msg.sender === userId ? "right" : "left",
                    color: msg.sender === userId ? "green" : "blue",
                  }}
                />
              </ListItem>
            ))
          ) : (
            <Box
              sx={{
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              No message
            </Box>
          )}
        </List>
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          sx={{
            mr: 1,
          }}
        />
        <Button variant="text" type="submit">
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
