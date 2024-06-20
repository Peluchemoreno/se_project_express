const express = require('express');

const mongoose = require('mongoose');

const mainRouter = require('./routes/index')

const app = express();
const {PORT = 3001} = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json())
app.use('/', mainRouter);
app.use((req, res, next)=>{
  req.user = {
    _id: '6673841494effdbd6270637d'
  };
  next();
})

app.listen(PORT, ()=>{
  console.log(`app running at http://127.0.0.1:${PORT}`);
})