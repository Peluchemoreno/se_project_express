const express = require('express');

const mongoose = require('mongoose');

const mainRouter = require('./routes/index')

const dataBase = "mongodb://127.0.0.1:27017/wtwr_db"

const app = express();
const {PORT = 3001} = process.env;
mongoose.connect(dataBase, ()=>{});

app.use(express.json())
app.use((req, res, next)=>{
  req.user = {
    _id: '6673841494effdbd6270637d'
  };
  next();
})
app.use('/', mainRouter);

app.listen(PORT, ()=>{})