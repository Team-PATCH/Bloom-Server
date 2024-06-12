// const sync = require('./models/sync');
// sync();

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT;

console.log('PORT:', process.env.PORT);
console.log('AZURE_STORAGE_CONNECTION_STRING:', process.env.AZURE_STORAGE_CONNECTION_STRING);
console.log('AZURE_CONTAINER_NAME:', process.env.AZURE_CONTAINER_NAME);

const marketsRouter = require('./routers/marketsRouter');
const productsRouter = require('./routers/productsRouter');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/markets',marketsRouter)
app.use('/products',productsRouter)

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})