const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_NAME,process.env.DB_PASS,process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwyjn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');

    const db = client.db(process.env.DB_NAME);
    const services = db.collection('products');
    const reviews = db.collection('reviews');
    const features = db.collection('features');
    const orders = db.collection('orders');
    const admins = db.collection('admin');

    app.get('/services', async (req, res) => {
      const documents = await services.find({}).toArray();
      res.send(documents);
    });

    app.get('/orders', async (req, res) => {
      const documents = await orders.find({ email: req.query.email }).toArray();
      res.send(documents);
    });

    app.get('/allorders', async (req, res) => {
      const documents = await orders.find({}).toArray();
      res.send(documents);
    });

    app.get('/admin', async (req, res) => {
      const documents = await admins.find({ email: req.query.email }).toArray();
      res.send(documents);
    });

    app.get('/features', async (req, res) => {
      const documents = await features.find({}).toArray();
      res.send(documents);
    });

    app.get('/reviews', async (req, res) => {
      const documents = await reviews.find({}).toArray();
      res.send(documents);
    });

    app.post('/addservices', async (req, res) => {
      const result = await services.insertOne(req.body);
      res.send({ success: result.acknowledged });
    });

    app.post('/addreview', async (req, res) => {
      const result = await reviews.insertOne(req.body);
      res.send({ success: result.acknowledged });
    });

    app.post('/addfeatures', async (req, res) => {
      const result = await features.insertOne(req.body);
      res.send({ success: result.acknowledged });
    });

    app.post('/addorders', async (req, res) => {
      const result = await orders.insertOne(req.body);
      res.send({ success: result.acknowledged });
    });

    app.post('/addadmin', async (req, res) => {
      const result = await admins.insertOne(req.body);
      res.send({ success: result.acknowledged });
    });

    app.patch('/updateorder/:id', async (req, res) => {
      const result = await orders.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { order_state: req.query.state } }
      );
      res.send(result);
    });

    app.delete('/deleteservice/:id', async (req, res) => {
      const result = await services.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.delete('/deletefeature/:id', async (req, res) => {
      const result = await features.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.delete('/deletereview/:id', async (req, res) => {
      const result = await reviews.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });
  } catch (err) {
    console.error(err);
  }
}

run();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
