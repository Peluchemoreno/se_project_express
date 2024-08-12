const express = require('express');

const cors = require('cors')

const mongoose = require('mongoose');

const mainRouter = require('./routes/index')

const dataBase = "mongodb://127.0.0.1:27017/wtwr_db"

const errorHandler = require('./middlewares/error-handler')

const {errors} = require('celebrate')

const {requestLogger, errorLogger} = require('./middlewares/logger')

const app = express();
const {PORT = 4000} = process.env;
mongoose.connect(dataBase, ()=>{});

app.use(cors())
app.use(express.json())

app.use(requestLogger)
app.use('/', mainRouter);


app.use(errorLogger)

app.use(errors())
app.use(errorHandler)

app.listen(PORT, ()=>{})