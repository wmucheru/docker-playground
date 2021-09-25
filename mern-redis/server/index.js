const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');

const { Pool } = require('pg');
const redis = require('redis');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS fibindexes (number INT)')
  .catch((err) => console.log(err));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/indexes/all', async (req, res) => {
  const indexes = await pgClient.query('SELECT * from fibindexes');

  res.send(indexes.rows);
});

app.get('/indexes/fibvalues', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/index', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO fibindexes(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listening');
});
