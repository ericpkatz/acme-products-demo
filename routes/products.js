var router = require('express').Router();
var db = require('../db');

module.exports = router;

router.get('/', function(req, res, next){
  db.getProducts(function(err, products){
    if(err){
      return next(err);
    }
    res.render('products', { products });
  });
});

router.delete('/:id', function(req, res, next){
  db.deleteProduct(req.params.id*1, function(err){
    if(err){
      return next(err);
    }
    res.redirect('/products');
  });
});

router.post('/', function(req, res, next){
  db.createProduct(req.body, function(err){
    if(err){
      return next(err);
    }
    res.redirect('/products');
  });
});
