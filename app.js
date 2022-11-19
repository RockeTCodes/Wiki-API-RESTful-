//requiring all the packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");





//intialising express
const app = express();



//setting view engine for ejs templates
app.set('view engine', 'ejs');



//setting express to use public folder for css
app.use(express.static("public"));


//initialising body bodyParser
app.use(bodyParser.urlencoded({extended:true}));


//connecting to mongoDB
mongoose.connect( "mongodb://127.0.0.1:27017/wikiDB");


//creating article Schema
const articleSchema = mongoose.Schema({
  title: String,
  content: String
});



//creating article model
const Article = mongoose.model("Article",articleSchema);





//chaining all the requests to the same app.route and targetiing all articles////////////////////////////////////////////////////////////////////////
app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }

    else{
      res.send(err);
    }
  });
})

.post(function(req,res){

const article = new Article({
  title:req.body.title,
  content:req.body.content
});

article.save(function(err){
  if(!err){
    res.send("All ok")
  }

  else{
    res.send(err);
  }
});

})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("All articles deleted");
    }

    else{
      res.send(err);
    }

  });
});




//chaining all the requests to the same app.route and targetiing all articles////////////////////////////////////////////////////////////////////////
app.route("/articles/:art")

.get(function(req ,res){
const reqTitle = req.params.art;
  Article.findOne({title:reqTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No matching articles found");
    }
  });
})


.put(function(req,res){
  const reqTitle = req.params.art;
  Article.update({title:reqTitle},{title:req.body.title,content:req.body.content},function(err){
    console.log(reqTitle);
    console.log(req.body.title);
    console.log(req.body.content);
    if(!err){
      res.send("Updation Successfull");
    }

    if(err){
      console.log(err);
      res.send(err);
    }
  });
})


.patch(function(req,res){
  const reqTitle = req.params.art;
  Article.update({title:reqTitle},{$set:req.body},function(err){

    if(!err){
      res.send("Updation Successfull");
    }

    if(err){
      console.log(err);
      res.send(err);
    }
  });
})

.delete(function(req,res){
  const reqTitle = req.params.art;
  Article.deleteOne({title:reqTitle},function(err){
    if(!err){
      res.send("Deletion Successfull")
    }

    else{
      res.send(err);
    }
  });
});













//server instantiation
app.listen(process.env.PORT||3000,function(){
  console.log("Server started.......");
});
