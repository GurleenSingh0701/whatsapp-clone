import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1428211",
  key: "05040f8ae85d98a3b021",
  secret: "d895abb60b32fb63ef02",
  cluster: "ap2",
  useTLS: true,
});


//middleware
app.use(express.json());

app.use(cors());

//DB Config
const connection_url='mongodb+srv://root:root@cluster0.ysrzxsj.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Db connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log("A change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("message", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api routes
app.get("/", (req, res) => res.status(201).send("Hello World"));

app.get("/messages/sync", (req, res) => {
  // const dbMessage = req.body;
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  });

//listen
app.listen(port, () => console.log(`Listening to port: ${port}`));