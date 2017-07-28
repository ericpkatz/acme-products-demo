var express = require('express');
var swig = require('swig');
swig.setDefaults({ cache: false });
var db = require('./db');

var app = express();

app.use(require('body-parser').urlencoded({ extended : false }));
app.use(require('method-override')('_method'));

app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use(function(req, res, next){
  db.getProducts()
    .then(function(products){
      res.locals.count = products.length;
      next();
    })
    .catch(function(err){
      next(err);
    });
});

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
  db.sync()
    .then(function(){
      return db.seed();
    })
    .then(function(){
      return db.getProducts();
    })
    .then(function(products){
      console.log(products);
    });
});
