// const sync = require('./models/sync');
// sync();

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

const marketsRouter = require('./routers/marketsRouter');
const productsRouter = require('./routers/productsRouter');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/markets',marketsRouter)
app.use('/products',productsRouter)

app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})