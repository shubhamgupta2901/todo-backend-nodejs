//mongodb CRUD operations

const mongodb = require('mongodb');
const MongoClient =  mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';


MongoClient.connect(connectionURL,{useNewUrlParser: true, useUnifiedTopology: true},(error, client)=>{
    if(error){
        console.log(error);
        return;
    }
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        name:'Shubham',
        age: 26,
    })

});

