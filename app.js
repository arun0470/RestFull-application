const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
  title:String,
  content:String
};
const Article = mongoose.model("Article",articleSchema);

////////////////////////////////////////////////  requests targeting and deleting all the articles /////////////////////////////
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  })
})
          // so here dont put semicolon we dont want to stop get request
.post(function(req,res){
  const title = req.body.title;
  const content =req.body.content;
  const article = new Article({
    title:title,
    content:content
  });
  article.save(function(err){
    if(!err){
      res.send("Successfully add the new artice.");
    }else{
      res.send(err);
    }
  });
})

          // so here dont put semicolon we dont want to stop post request
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    }else{
      res.send(err);
    }
  })
});

////////////////////////////////////////////////  requests targeting and deleting A specific articles /////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles found matching that article.");
    }
  })
})

.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    // {overwrite:true}, overwrite is not allowed in mongodb present verdion
    function(err){
      if(!err){
        res.send("Successfully updated the PUT data.");
      }else{
        console.log(err);
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the PATCH data.");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article.");
      }else{
        res.send(err);
      }
    }
  )
});

app.listen(3000,function(req,res){
  console.log("server started at port 3000");
})
