let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;


let app = express();
let db;

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/students/:id', (req, res) => {
    let student = students.find(student => student.id === Number(req.params.id))
    res.send(student);
})

app.post('/students', (req, res) => {
    let student = {
        id: Date.now(),
        name: req.body.name
    }
    student.push(student);
    res.send(student);
})

app.put('/students:id', (req, res) => {
    let student = students.find(student => student.id === Number(req.params.id))
    student.mane = req.body.name
    res.sendStatus(200);
})

app.delete('/students/:id', (req, res) => {
    students = students.filter(student => student.id !== Number(req.params.id));
    res.sendStatus(200);
})

client.connect(function(err) {
    console.log('Connected succesfully to server...');

    db = client.db(dbName);
    app.listen(3333, () => console.log('API started'));
})