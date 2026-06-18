const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect("mongodb+srv://hassanzkhan27_db_user:zohaibkhan123@myfrirstmaddb.xc4lxbk.mongodb.net/?retryWrites=true&w=majority&appName=myfrirstMADdb")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Schema for Todo items
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// ✅ Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// ✅ Add a new todo
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  await newTodo.save();
  res.json(newTodo);
});

// ✅ Toggle completion (mark done / undone)
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// ✅ Delete a todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
