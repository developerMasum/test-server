const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle ware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// mongodb+srv:Carwebsite:ash420AQ@cluster0.x0rjvov.mongodb.net/?retryWrites=true&w=majority
const uri =
  "mongodb+srv://carwebsite:tH558zj6KOEAIlXU@cluster0.x0rjvov.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    // Send a ping to confirm a successful connection

    const carCollection = client.db("car").collection("toyota");
    const carDetailsCollection = client.db("car").collection("details");
    // const orderCollection = client.db("torCarDB").collection("orderCollection");

    // step-1
    app.get("/allcar", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/details", async (req, res) => {
      const cursor = carDetailsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/fulldetails/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }; // Convert the ID to a MongoDB ObjectId
        const result = await carDetailsCollection.findOne(query); // Use findOne to get a single result
        if (result) {
          res.json(result); // Send the result as JSON
        } else {
          res.status(404).json({ message: "Car not found" }); // Handle the case when the car is not found
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" }); // Handle server errors
      }
    });

    // post a new toy
    app.post("/car", async (req, res) => {
      const addNew = req.body;
      console.log(addNew);
      const result = await carDetailsCollection.insertOne(addNew);
      res.send(result);
    });

    // delete by id -
    // app.delete("/order/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await orderCollection.deleteOne(query);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car toy shop");
});

app.listen(port, () => {
  console.log(`Car shop running on PORT  ${port}`);
});
