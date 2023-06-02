const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require("./router/auth");

dotenv.config({path : './config.env'})

// database connect 
require('./db/conn');
 
// accept json middleware
app.use(express.json());


app.use(auth)

// port 
const PORT = process.env.PORT;

const middleware = (req, res, next) =>{
    next();
}

app.get("/", (req, res) =>{
    res.send("Hello From Backend");
});

app.get("/about",middleware, (req,res)=>{
    res.send("hello about")
})
app.get("/contact",(req,res)=>{
    res.cookie('test' , "pappu")
    res.send("hello contact")
})
app.get("/signin",(req,res)=>{
    res.send("hello signin")
})
app.get("/signup",(req,res)=>{
    res.send("hello signup")
})
app.listen(PORT , ()=>{
    console.log(`Now server is running in ${PORT} port`);

})

