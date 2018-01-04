const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const files = [];
const filePath = './data.csv';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/home', express.static(__dirname + '/index.html'));


app.get('/', (req, res) => {
  if (req.query.id) {
    let itm = files.find((i) => (i.id === req.query.id));
    if (itm) {
      res.send(itm);
    } else {
      res.send('Archivo no encontrado');
    }
    return;
  }
  res.send(files);
});

app.post('/', (req, res) => {
  files.push({
    id: req.body.id,
    type: req.body.type,
    date: new Date()
  });
  if (!req.body.id || !req.body.type) {
    res.send('ERROR. req.id or req.type no estan definidos en el body');
    return;
  }
  fs.appendFileSync(filePath, req.body.id + ',' + req.body.type + ',' + new Date() + '\n');
  res.send({status: 'OK'});
});

const data = fs.readFileSync(filePath, 'utf8');
data.split('\n').forEach((item) => {
  if (item.split(',')[0]) {
    files.push({
      id: item.split(',')[0],
      type: item.split(',')[1],
      date: item.split(',')[2],
    })
  }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

