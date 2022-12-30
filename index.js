const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://dbuserfortodo:Kn3fs1Asvs77HcCA@cluster0.verqpx7.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const todoList = client.db("TODOAPP").collection("todolist");
    const todoNotes = client.db("TODOAPP").collection("todoComments");

    // all tasks
    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = todoList.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    // tasks api to create new task
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await todoList.insertOne(task);
      res.send(result);
    });

    // tasks api to get id basis tasks
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await todoList.findOne(query);
      res.send(task);
    });

    // delete task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoList.deleteOne(query);
      res.send(result);
    });

    //according to email
    app.get("/tasks", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          userEmail: req.query.email,
        };
      }
      const cursor = todoList.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });

    // notes collection
    // create new notes
    app.post("/notes", async (req, res) => {
      const notes = req.body;
      const result = await todoNotes.insertOne(notes);
      res.send(result);
    });

    // get notes
    app.get("/notes", async (req, res) => {
      let query = {};
      if (req.query.taskId) {
        query = {
          taskId: req.query.taskId,
        };
      }
      const cursor = todoNotes.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // notes query according to email
    app.get("/mynotes", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          userEmail: req.query.email,
        };
      }
      const cursor = todoNotes.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });
    // delete notes

    app.delete("/notes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoNotes.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Photographer car server is running");
});

app.listen(port, () => {
  console.log("server is running");
});
