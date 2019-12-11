'use strict';

const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = 'mongodb://mongoadmin:secret@localhost:27017';

function getConnectionMongo() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUri, { useNewUrlParser: true } , (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

app.get('/', function ping(req, res) {
  res.send('My super mega mongo application!');
});

app.get('/load', async function loadData(req, res, next) {
  let count = 0;
  const max = 10000;

  try {
    const client = await getConnectionMongo();
    const db = client.db('workshop');
    const collection = db.collection('nodes');

    function insert(err) {
      if (err) throw err;

      if (count++ === max) {
        return client.close();
      }

      collection.insertOne({
        node: parseInt(Math.random() * 100),
        quantity: parseInt(Math.random() * 10) + 1,
        price: Math.random() * 1000,
      }, insert);
    }

    insert();
    res.send('load exitoso');
  } catch (err) {
    throw err;
    next(err);
  }
});

app.get('/nodes/:id', async function getNodesById(req, res, next) {
  try {
    const client = await getConnectionMongo();
    const db = client.db('workshop');
    const collection = db.collection('nodes');
    const node = parseInt(req.params.id);

    collection.find({ node }).toArray((err, results) => {
      const total = results.reduce((a, e) => a += e.price * e.quantity, 0);
      res.send({ total })
    });
  } catch (error) {
    throw error;
    next(error);
  }
});

app.use(function handleError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(port, function init() {
  console.log(`App listening on port ${port}!`);
});
