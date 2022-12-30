const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
"mongodb+srv://todoAdmin:8nnqJlLPVme83qHJ@cluster0.verqpx7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
const collection = client.db("todo").collection("todocollection");
// perform actions on the collection object
console.log("database connected");
client.close();
});

async function run() {
try {
const todoList = client.db("todo").collection("todocollection");
const todoComments = client.db("todo").collection("todoComments");

    // tasks get
    app.get("/allTasks", async (req, res) => {
      const query = {};
      const cursor = todoList.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // tasks post
    app.post("/allTasks", async (req, res) => {
      const data = req.body;
      const result = await todoList.insertOne(data);
      res.send(result);
    });

    // completed tasks

    app.get("/completed", async (req, res) => {
      const query = { completed: true };
      const cursor = todoList.find(query).sort(sort);
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete task
    app.delete("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoList.deleteOne(query);
      res.send(result);
    });

    // category
    app.get("/category", async (req, res) => {
      const query = {};
      const cursor = ourCategories.find(query);
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });
    // create category

    app.post("/category", async (req, res) => {
      const body = req.body;
      const result = await ourCategories.insertOne(body);
      res.send(result);
    });

    //  category wise data

    app.get("/category/:id", async (req, res) => {
      const categoryId = req.params.id;
      const queryTwo = { _id: ObjectId(categoryId) };
      const cursorTwo = ourCategories.find(queryTwo);
      const resultTwo = await cursorTwo.toArray();

      const sort = { postedDate: 1 };
      // const options = { category_id: categoryId };
      const query = { category_id: categoryId };
      const cursor = todoList.find(query).sort(sort);
      const result = await cursor.toArray();
      const finalResult = [resultTwo, result];
      res.send(finalResult);
    });

    // email based booking

    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      const query = { bookingPersonEmail: email };
      const bookings = await meetingBooking.find(query).toArray();
      res.send(bookings);
    });

    //////////////////// comments //////////////////////
    // create new comment
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await todoComments.insertOne(review);
      res.send(result);
    });
    // get new comment
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.serviceId) {
        query = {
          serviceId: req.query.serviceId,
        };
      }
      const cursor = todoComments.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // tasks according to email
    app.get("/myReviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          userEmail: req.query.email,
        };
      }
      const cursor = todoComments.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);

      // delete comment

      app.delete("/reviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await todoComments.deleteOne(query);
        res.send(result);
      });
    });

} catch {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
res.send("todo server is listening on port " + port);
});
app.get("/test", (req, res) => {
res.send("todo server is listening on port " + port);
});

app.listen(port, () => console.log("server is listening on port " + port));
