const express = require('express');
const {Client} = require('pg');
//:NOTE -> requiring without putting it in a var just calling instantly, loads up env file vars instantly
require('dotenv').config();
const app = express();
const client = new Client();

//:NOTE -> setting up to auto use public dir,if it has index.js it will auto show in root route
app.use(express.static('public'));

// client.connect() 

//////////////////issue with downloading postgress app and manager



app.get('/', (req,res) => {
    
    
})



 //:NOTE -> use env file variables by going process.env.newVar
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server started on port:${port}`)
})