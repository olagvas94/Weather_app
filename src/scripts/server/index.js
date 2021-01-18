let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;

let app = express();
let db;

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
})
app.get('/cities', (req, res) => {
    db.collection('cities').find().toArray((err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs)
    })
})

app.post('/add', (req, res) => {
    if (req.body.name) {
        let city = {
            name: req.body.name
        }
        db.collection('cities').insertOne(city, (err, result) => {
            if (err) {
                return res.sendStatus(500);
            } else {
                res.send(result.ops[0]._id);
            }
        })
    }

})

// app.put('/students:id', (req, res) => {
//     let student = students.find(student => student.id === Number(req.params.id))
//     student.mane = req.body.name
//     res.sendStatus(200);
// })

app.get('/' + ':id', (req, res) => {
    db.collection('cities').findOne({_id: ObjectId(req.params.id)}, (err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
})
app.delete('/' + ':id', (req, res) => {
    db.collection('cities').deleteOne({_id: ObjectId(req.params.id)}, (err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
})

client.connect(function(err) {
    console.log('Connected succesfully to server...');

    db = client.db(dbName);
    app.listen(3333, () => console.log('API started'));
})