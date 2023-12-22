import Database from "better-sqlite3";
import express from "express";
import cors from "cors";
// import bodyParser from "body-praser";

const app = express();
const port = 8080;
const db = new Database("messages.db");

app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

app.get("/", (req, res) => {
  req.body;
  res.json("getting server");
});

app.get("/message", (req, res) => {
  let message = [];

  if (req.query.id) {
    message = db
      .prepare(`SELECT * FROM messages WHERE id=${req.query.id}`)
      .all();
  } else {
    message = db.prepare("SELECT * FROM messages").all();
  }

  res.json(message);
});

app.post("/message", (req, res) => {
  const { userName, message } = req.body;

  const newMessage = db
    .prepare(`INSERT INTO messages (userName, message) VALUES (?, ?)`)
    .run(userName, message);
  res.json(newMessage);
});

app.delete("/delete-message/:id", (req, res) => {
  const messageId = req.params.id;
  console.log(messageId);

  const deleteMessage = db.prepare("DELETE FROM messages WHERE id = ?");
  const result = deleteMessage.run(messageId);

  if (result.changes > 0) {
    res.json({ success: true, message: "Record deleted successfully" });
  } else {
    res.status(404).json({ success: false, message: "Record not found" });
  }
});

app.listen(port, () => {
  console.log(`App is running ${port}`);
});
