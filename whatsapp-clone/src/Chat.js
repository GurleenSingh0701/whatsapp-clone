import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import * as icon from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { db } from "./firebase-config";
import { useStateValue } from "./StateProvider";
import firebase from "./firebase-config";


function Chat() {
  const [input, setInput] = useState("");
  const { roomsId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [seed, setSeed] = useState("");
  const [{ user },dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomsId]);

  useEffect(() => {
    if (roomsId) {
      db.collection("rooms")
        .doc(roomsId)
        .onSnapshot((querySnapshot) => {
          setRoomName(querySnapshot.data().name);
        });
        db.collection('rooms').doc(roomsId).collection("messages").orderBy("timestamp","asc").onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()))
      });
    }
  },[roomsId]);
  const sendMessage = async (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomsId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };
  
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3 className="chat-room-name">{roomName}</h3>
          <p className="chat-room-last-seen">
            {" "}
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <icon.SearchOutlined />
          </IconButton>
          <IconButton>
            <icon.AttachFile />
          </IconButton>
          <IconButton>
            <icon.MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_receiver"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestemp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <icon.InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />

          <button type="submit" onClick={sendMessage}>
            Send a Message
          </button>
        </form>

        <icon.Mic />
      </div>
    </div>
  );
}
export default Chat;
