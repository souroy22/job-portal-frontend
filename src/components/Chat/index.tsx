import { FC, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Typography,
} from "@mui/material";
import AXIOS from "../../configs/axios.confog";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

interface Message {
  sender: string;
  message: string;
  createdAt: string;
}

interface PROP_TYPE {
  userId: string;
  otherUserId: string;
  receiverDetails: { name: string; email: string };
  onClose: () => void;
  socket: Socket;
}

const Chat: FC<PROP_TYPE> = ({
  userId,
  otherUserId,
  receiverDetails,
  onClose,
  socket,
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

  useEffect(() => {
    onLoad();
    return () => {
      socket.off("receive-message");
      socket.emit("disconnected", { userId });
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
    <Box sx={{ position: "relative", height: "90svh" }}>
      <CloseIcon
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
        }}
        onClick={onClose}
      />
      <Box
        sx={{
          width: "100%",
          height: "80px",
          backgroundColor: "orange",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "10px",
            gap: "10px",
          }}
        >
          <Avatar sx={{ height: "55px", width: "55px" }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {receiverDetails.name}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>
              {receiverDetails.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(100% - 80px)",
          bgcolor: "#F5F7FB",
          color: "gray",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
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
                  <Box
                    sx={{
                      maxWidth: "70%",
                      padding: "10px 15px",
                      borderRadius:
                        msg.sender === userId
                          ? "20px 0 20px 20px"
                          : "20px 20px 20px 0",
                      bgcolor: msg.sender === userId ? "#D1E7DD" : "#FFF",
                      color: "#212529",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      textAlign: msg.sender === userId ? "right" : "left",
                    }}
                  >
                    {msg.message}
                  </Box>
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
                  color: "#6C757D",
                }}
              >
                No messages yet
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
            bgcolor: "#d9d9d9",
            borderRadius: "20px",
            width: "95%",
            margin: "auto",
            height: "50px",
            marginBottom: "10px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            autoComplete="off"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            sx={{
              mr: 1,
              bgcolor: "transparent",
              border: "none",
              "& fieldset": {
                border: "none",
              },
            }}
          />
          <Button
            variant="text"
            type="submit"
            disabled={!newMessage.length}
            sx={{
              "&:hover": {
                bgcolor: "transparent",
              },
            }}
          >
            <SendIcon sx={{ color: !newMessage.length ? "gray" : "" }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
