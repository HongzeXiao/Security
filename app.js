//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { urlencoded } = require("body-parser");
const mongoose=require("mongoose");
const md5=require("md5");

const app=express();
const port=3000;



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
});

const User= new mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
    res.render('home.ejs');
});

app.get('/login',(req,res)=>{
    res.render('login.ejs');
});

app.get('/register',(req,res)=>{
    res.render('register.ejs');
});

app.post("/register",(req,res)=>{
    const newUser= new User({
        email:req.body.username,
        password:md5(req.body.password),
    })

    newUser.save().then(()=>{
        res.render("secrets");
    } 
    ).catch((err)=>{
        console.log(err);
    });
});


app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=md5(req.body.password);

    User.findOne({email:username}).then((foundUser)=>{
        if (foundUser.password===password){
            res.render("secrets");
        }
    }).catch((err)=>{
        console.log(err);
    });
});







app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
