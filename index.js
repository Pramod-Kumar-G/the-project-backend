const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const Todo = require("./todo.model");
const connectDB = require("./dbConnect");

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));

app.get("/", async (_req, res) => {
  res.send("ok");
});

app.get("/todos", async (_req, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

app.post("/todos", async (req, res) => {
  const savedTodo = await Todo.create(req.body);
  res.send(savedTodo);
});

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    console.error(
      error.name,
      ": Todo length should be less than or equal to 140",
    );
  }
  next();
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Todo Backend running on port ${PORT}`);
});
