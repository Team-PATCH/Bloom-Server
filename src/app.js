const sync = require('./models/sync');
sync();
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})