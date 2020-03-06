var express = require('express');
var path = require('path');
var port = 3000;
var bodyParser = require('body-parser');
var Bcrypt = require("bcryptjs");
const mongoose =require('mongoose');
mongoose.connect("mongodb://localhost:27017/user");
var Schema = mongoose.Schema;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const UserSchema = new Schema({
    Name:
    {
      type: String,
      default :''
    },
    userName:
    {
      type: String,
      default :'',
      unique:true
    },
    email:
    {
      type: String,
      default :'',
      unique:true
    },
    Password:
    {
      type: String,
      default :''
    },
    Gender:
    {
      type: String,
      default :''
    },
    Country:
    {
      type: String,
      default :''
    },
    mobileN:
    {
      type: String,
      default :'',
      unique:true
    },  
  });
var User = mongoose.model("User", UserSchema); 
app.get('/', (req, res,next) =>{
        User.find({}).then((user)=>{
            res.json(user);
        },(err)=>next(err))
        .catch((err)=>next(err));
});
app.post('/login',(req,res,next)=>{
  let count= true;
  User.find({userName:req.body.userName},function(err,docs){
    if(!(docs.length>0)){
      res.json({"message":"nouser"});
      return;
    }
    else{
    Bcrypt.compare(req.body.Password,docs[0].Password,function(err, result){
    if(result){
        res.json({"message":"success"});
        return;
    }
    else{
        res.json({"message":"incorrect"})
    return;
    }
    });

  }
  });
});
app.post('/posts',(req,res,next)=>{
    let count=true;
    req.body.Password = Bcrypt.hashSync(req.body.Password, 10);
    User.find({ $or: [ { email: req.body.Password }, { mobileN:req.body.mobileN },{userName:req.body.userName} ] },function(err,docs){
      if(docs.length>0){
          let Leng=docs.length;
          let response="";
          console.log(docs[0].email);
          for(let i=0;i<Leng;i++){
            if(docs[i].email===req.body.email){
        res.json({"message":"Email"});
        return;
      }
            else if(docs[i].mobileN===req.body.mobileN){
        res.json({"message":"Number"});
        return;
            }
            else if(docs[i].userName===req.body.userName){
        res.json({"message":"Username"});
        return;
            }
          }
       }
       else{
        User.create(req.body).then((item)=>{
          console.log("data saved");
          res.statusCode=200;
          res.json({"message":"success"});
        },(err)=>{
          next(err)})
        .catch((err)=>next(err));
       }
     })
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))