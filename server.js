const express = require('express');
const bodyParser = require('body-parser');
const {Client} = require('pg'); //destructuring with es6

//:NOTE -> requiring without putting it in a var just calling instantly, loads up env file vars instantly
require('dotenv').config();
const app = express();
const router = express.Router();
const user = require('./Routes/userRoutes');
const todos = require('./Routes/todoRoutes');

//:NOTE -> setting up to auto use public dir,if it has index.js it will auto show in root route
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

/////////// ROUTES ////////////////
app.use('/user',user);
app.use('/todo',todos);


 //:NOTE -> use env file variables by going process.env.newVar
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server started on port:${port}`)
})

