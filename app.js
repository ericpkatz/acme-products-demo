var express = require('express');
var db = require('./db');

var app = express();

var port = process.env.PORT || 3000;


app.listen(port, function(){
  console.log(`listening on port ${port}`);
  db.sync(function(err){
    if(err){
      return console.log(err.message);
    }
    db.seed(function(err){
      if(err){
        return console.log(err.message);
      }
      db.getProducts(function(err, products){
        if(err){
          return console.log(err.message);
        }
        console.log(products);
      });
    });
  });
});
