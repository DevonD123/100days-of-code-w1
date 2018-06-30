const express = require('express');
const bodyParser = require('body-parser');
const {Client} = require('pg'); //destructuring with es6

//:NOTE -> requiring without putting it in a var just calling instantly, loads up env file vars instantly
require('dotenv').config();
const app = express();

//:NOTE -> setting up to auto use public dir,if it has index.js it will auto show in root route
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

/////////// ROUTES ////////////////
app.get('/todo/:id',(req,res) => {
    const client = new Client();
    client.connect()
        .then(() => {
            const sql = 'SELECT * FROM todos WHERE todo_id = $1;';
            const params = [req.params.id]
            return client.query(sql,params);
        })
        .then(result => {
            res.json(result.rows)
        })
        .catch(err => res.json(err) )
})
app.get('/todos', (req,res) => {
    //get all todo
    const client = new Client();
    client.connect()
        .then(() => {
            console.log('connection opened');
            return client.query('SELECT * FROM todos') 
            //can add while todo_id = x to just return with the specific id
        })
        .then(results =>{
            res.json(results.rows);
            //if you want to see table id you can use fields
        })
        .catch(err => res.json(err) ) 
});
app.post('/todo', (req,res)=>{
    //add a todo to db
    //connect
    const client = new Client();
    client.connect() 
        .then(()=>{
            console.log('connection opened');
            //use params to avoid sql injection attacks (limit ability to do)
            // parmiters are defined by $int $int2 --> eg make a params arr $1 is first $2 is second
       //query db
            const sql = 'INSERT INTO todos (text,completed) VALUES ($1,$2)'  //using params here ($1$2)
            const params =[req.body.text,false];
            return client.query(sql, params);
        })
        .then(result => {
            client.end();
            res.json(result);
        })
        .catch(err => {
             res.json(err);
        })
    //get list
    //-- redirect in .then to page with list/json data
});

app.delete('/todo/:id',(req,res) => {
    const client = new Client();
    client.connect()
        .then(() => {
            const sql = 'DELETE FROM todos WHERE todo_id = $1';
            const params = [req.params.id]
            return client.query(sql,params)
            //if where was not ther it would remove all
        })
        .then(result => {
            if(result.rowCount >=1){
                console.log(`you have deleted the todo with id: ${req.params.id}`)
                return res.json(result)
            }else{
                console.log(`we could not find the todo with an id of: ${req.params.id}`)
                return res.json('please try again, we could not find your todo')
            }
        })
        .catch(err => res.json(err) )
})
app.put('/todo/:id',(req,res) => {
    const client = new Client();
    client.connect()
        .then(() => {
            const sql = 'UPDATE todos SET completed =NOT completed  WHERE todo_id = $1';
            //where is veryyyyy important otherwise will do to all + NOT will work with postgresql not =!
            const params = [req.params.id]
            return client.query(sql,params)
        })
        .then(result => {
            res.json(result);
        })
        .catch(err => res.json(err) )
})



 //:NOTE -> use env file variables by going process.env.newVar
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server started on port:${port}`)
})

