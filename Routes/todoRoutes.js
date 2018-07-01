const express = require('express');
const {Client} = require('pg');
const router = express.Router();
 
//get all todo
router.get('/', (req,res) => {   
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
//get all of specific users todos
router.get('/user/:user_id', (req,res) =>{
    const client = new Client();
    client.connect()
        .then(() => {
            const sql = 'SELECT * FROM users INNER JOIN todos ON users.user_id = todos.user_id WHERE users.user_id = $1;'
            const params = [req.params.user_id];
            return client.query(sql,params);
        })
        .then(results => {
            res.json(results.rows)
        })
        .catch(err => res.json(err) )
})
//get specific todo
router.get('/:id',(req,res) => {
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
///make get todo by user id

///////
//add a todo to db
router.post('/', (req,res)=>{
    const client = new Client();
    client.connect() 
        .then(()=>{
            console.log('connection opened');
            //use params to avoid sql injection attacks (limit ability to do)
            // parmiters are defined by $int $int2 --> eg make a params arr $1 is first $2 is second
            const sql = 'INSERT INTO todos (text,completed,user_id) VALUES ($1,$2,$3)'  //using params here ($1$2)
            const params =[req.body.text,false,req.body.user];
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
//delet select todo
router.delete('/:id',(req,res) => {
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
//update completed status of todo
router.put('/:id',(req,res) => {
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

module.exports = router;