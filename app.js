const express = require('express');

const cors = require('cors')

const mongoose = require('mongoose');

const mainRouter = require('./routes/index')

const dataBase = "mongodb://127.0.0.1:27017/wtwr_db"

const app = express();
const {PORT = 3001} = process.env;
mongoose.connect(dataBase, ()=>{});

app.use(cors())
app.use(express.json())
app.use('/', mainRouter);

app.listen(PORT, ()=>{})