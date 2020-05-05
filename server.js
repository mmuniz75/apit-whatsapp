const express = require('express');
const bodyParser = require('body-parser');

const messengerService = require('./services/messenger');
require('./config/config');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,access-token');
  next();
});


app.post('/login', async (req, res) => {
  try{ 
    buffer = await messengerService.login(req.header('phone'));
    res.writeHead(200, [['Content-Type', 'data:image/png;base64']]);
    res.end(buffer);
    
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.post('/logout', async (req, res) => {
  try{ 
    messengerService.logout(req.header('phone'));
    res.sendStatus(200);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.post('/messages', async (req, res) => {
  try{ 
    response = await messengerService.send(req.header('phone'),req.body.text,req.body.groups);
    res.sendStatus(200);
  }catch(e){
  if(e.message === '403')
    res.status(403).send({"message" :"Usuário não logado"});   
  else  
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
