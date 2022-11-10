import "./App.css";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher("05040f8ae85d98a3b021", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("message");
    channel.bind("inserted", function (newMessage) {
      setMessages([...messages, newMessage]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Sidebar />
                  <Chat messages={messages} />
                </>
              }
            />
            <Route
              path="/rooms/:roomsId"
              element={
                <>
                  <Sidebar />
                  <Chat messages={messages} />
                </>
              }
            />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
