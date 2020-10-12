const express=require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbname="hospitalmanagement";
let db

MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database: ${url}`);
    console.log(`Database:${dbname}`);
});

app.get('/hospital', middleware.checkToken, (req,res)=>{
    console.log("getting things ready");
    var data=db.collection("hospital").find().toArray()
    .then(result => res.json(result));
});

app.get('/ventilator', middleware.checkToken, (req,res)=>{
    console.log("getting things ready");
    var data=db.collection("ventilator").find().toArray()
    .then(result=>(res.json(result)));
});

app.post('/searchventilatorbystatus', middleware.checkToken, (req,res) => {
    var status = req.body.status;
    console.log(status);
    var ventilator=db.collection('ventilator')
    .find({"status":status}).toArray().then(result=>res.json(result));
});

app.post('/searchventilatorbyname', middleware.checkToken, (req,res) => {
    var name=req.query.Name;
    console.log(Name);
    var ventilator=db.collection('ventilators')
    .find({'Name':new RegExp(Name, 'i')}).toArray().then(result=>res.json(result));
});

app.post('/searchhospital', middleware.checkToken, (req,res) => {
    var Name=req.query.Name;
    console.log(Name);
    var ventilator=db.collection('hospital')
    .find({'Name':new RegExp(Name, 'i')}).toArray().then(result=>res.json(result));
});

app.post('/addvent',(req,res)=>{
    var hid=req.query.hid;
    var ventilatorId=req.query.ventilatorId;
    var status=req.query.status;
    var name=req.query.name;
    console.log("adding ventilator, please wait a moment");
    var item={"hid":hid, "ventilatorId":ventilatorId, "status":status, "Name":Name};
    db.collection("ventilator").insertOne(item, function(err, result){
        res.json("inserted successfully");
    });
});

app.put('/updateventilator', middleware.checkToken, (req,res) => {
    var ventilatorId= {ventilatorId: req.query.ventilatorId};
    console.log(ventilatorId);
    var newvalues={$set: {status:req.query.status}};
    console.log("updating ventilator details, please wait a moment");
    db.collection("ventilator").updateOne(ventilatorId, newvalues, function(err, result){
        res.json('updated one document');
        if(err) throw err;
    });
});

app.delete('/deletevent', middleware.checkToken, (req,res) => {
    var ventilatorId=req.query.ventilatorId;
    console.log(ventilatorId);
    var temp={"ventilatorId":ventilatorId};
    db.collection("ventilators").deleteOne(temp, function(err,obj){
        if(err) throw err;
        res.json("deleted one element");
    });
});

app.get('/searchventilators',(req,res)=>{
    var status=req.query.status;
    var Name=req.query.Name;
    console.log("searching ventilators, please wait a moment");
    var data=db.collection("ventilator").find({"Name":Name},{"status":status}).toArray().then(result=>res.send(result));
    res.send("no hospital found :(");
});

app.listen(9000);
