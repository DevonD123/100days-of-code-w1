const express = require('express');
const {Client} = require('pg');
const router = express.Router();


router.get('/',(req,res)=>{
    const client = new Client();
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM users') 
        })
        .then(users =>{
            res.json(users.rows);
        })
        .catch(err => res.json(err) ) 
})
router.post('/',(req,res) => {
    const client = new Client();
    client.connect()
        .then(() =>{
            //will need to hash
            const params = [req.body.email,req.body.pword,req.body.username];
            client.query('SELECT email FROM users WHERE email = $1',params,(err,res)=>{
                if(!res){
                    const sql = 'INSERT INTO users (email,pword,username) VALUES ($1,$2,$3)';
                    return client.query(sql,params);
                }
            })
        })
        .then(addedResult => { return res.json(addedResult)} )
        .catch(err => res.json(err) )
})

module.exports = router;