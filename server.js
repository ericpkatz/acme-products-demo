var express = require('express');
var swig = require('swig');
swig.setDefaults({ cache: false });
var db = require('./db');

var app = express();

app.use(require('body-parser').urlencoded({ extended : false }));
app.use(require('method-override')('_method'));

app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.get('/', function(req, res, next){
  res.render('index');
});

app.use('/products', require('./routes/products'));

app.use(function(err, req, res, next){
  res.render('error', { error: err } );
});

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
