//mongodb CRUD operations

const mongodb = require('mongodb');
const MongoClient =  mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(connectionURL,{useNewUrlParser: true, useUnifiedTopology: true},(error, client)=>{
    if(error){
        console.log(error);
        return;
    }
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        _id: 2234,
        name:'Cho Chang',
        age: 22,
    },(error,result)=>{
        if(error){
            console.log(error.message)
            return;
        }
        console.log(result.ops);
    })
    db.collection('users').insertMany([{
        name:'SG',
        age: 22s
    },{
        name: 'Ron',
        age: 27
    }],(error,result)=>{
        if(error){
            console.log('Unable to insert users');
            return;
        }
        console.log(result.ops);
    })

    db.collection('tasks').insertMany([
        {
            description:'Watch Black Mirror',
            completed: false,
        },
        {
            description:'ListenNotes Podcast',
            completed: true,
        },
        {
            description:'Attend Meeting',
            completed: false,
         }
    ],(error, result)=>{
        if(error){
            console.log(error.message);
            return;
        }
        console.log(result.ops);
    })

    db.collection('users').insertOne({
        name:'Serius Black',
        age: 45,
    },(error,result)=>{
        if(error){
            console.log(error.errmsg)
            return;
        }
        console.log(result.ops);
    })

    db.collection('users').findOne({_id: ObjectID("5d8a2b4c744ad43fc1fbde8d")}, (error,result)=> {
        if(error){
            console.log(error.message);
            return;
        }
        console.log(result);
    });

    db.collection('users').find({name: {$in: ['Shubham','Ron']}}).toArray((error, result)=>{
        if(error){
            console.log(error.message);
            return;
        }
        console.log(result);
    });

    db.collection('tasks').findOne({_id: ObjectID("5d892b8983a6a316e2c7d229")},(error, result)=>{
        if(error){
            console.log(error.message);
            return;
        }
        console.log(result);        
    })

    db.collection('tasks').find({completed: false}).toArray((error,result)=>{
        if(error){
            console.log(error.message);
            return;
        }
        console.log(result);         
    });
    db.collection('users').updateOne({_id: ObjectID('5d890f457bd45c13a4759c1d')},{$set: {name: 'Lucius Malfoy', age: 19}},(error,result)=>{
                if(error){
            console.log(error.message);
            return;
        }
        console.log(result); 
    });

    db.collection('users')
    .updateOne({
        _id: ObjectID('5d890f457bd45c13a4759c1d')
    },{
        $set: {name: 'Ginny Weasley', age: 19}
    }).then(result =>{
        console.log(result.ops);
    }).catch(error=>{
        console.log(error);
    });

    db.collection('tasks')
    .updateMany({completed: false},{ $set: {completed: true}})
    .then(result=>{
        console.log('done');
    })
    .catch(error=>{
        console.log(error)
    })
});

