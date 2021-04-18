const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;
//////////////////////

const MongoClient = require("mongodb").MongoClient;
const uri = ` mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.yvlli.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
/////////////////////
client.connect((err) => {
  const services = client.db(DB_NAME).collection("products");
  const reviews = client.db(DB_NAME).collection("reviews");
  const features = client.db(DB_NAME).collection("features");
  const orders = client.db(DB_NAME).collection("orders");
  const admins = client.db(DB_NAME).collection("admin");

  // perform actions on the collection object
  app.get("/services", (req, res) => {
    services.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/orders", (req, res) => {
    orders.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/admin", (req, res) => {
    admins.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/features", (req, res) => {
    features.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviews.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addservices", (req, res) => {
    const serviceData = req.body;
    services.insertOne(serviceData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addreview", (req, res) => {
    console.log(req.body);
    const reviewData = req.body;
    reviews.insertOne(reviewData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addfeatures", (req, res) => {
    console.log(req.body);
    const featuresData = req.body;
    features.insertOne(featuresData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addorders", (req, res) => {
    console.log(req.body);
    const orderData = req.body;
    orders.insertOne(orderData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addadmin", (req, res) => {
    console.log(req.body);
    const admin = req.body;
    admins.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //deleting product
  app.delete("/deleteservice/:id", (req, res) => {
    services
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => res.send(result));
  });

  app.delete("/deletefeature/:id", (req, res) => {
    console.log(req);
    features
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => res.send(result));
  });
  app.delete("/deletereview/:id", (req, res) => {
    console.log(req);
    reviews
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => res.send(result));
  });
});
app.listen(process.env.PORT || port);
