import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import * as icon from "@mui/icons-material";
import SidebarChat from "./SidebarChat";
import { db } from "./firebase-config.js";
import { useStateValue } from './StateProvider';
function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{user}] = useStateValue();
  useEffect(() => {
    db.collection("rooms").onSnapshot((querySnapshot) => {
      setRooms(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data(), }))
      );
    });
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL}/>
        <div className="sidebar_headerRight">
          <IconButton>
            <icon.DonutLarge />
          </IconButton>
          <IconButton>
            <icon.Chat />
          </IconButton>
          <IconButton>
            <icon.MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <icon.SearchOutlined />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat name={room.data.name} key={room.id} id={room.id}/>
        ))}
      </div>
    </div>
  );
}
export default Sidebar;
