var router = require('express').Router();
var db = require('../db');

module.exports = router;

router.get('/', function(req, res, next){
  db.getProducts()
    .then(function(products){
      res.render('products', { products });
    })
    .catch(function(err){
      next(err);
    });
});

router.delete('/:id', function(req, res, next){
  db.deleteProduct(req.params.id*1)
    .then(function(){
      res.redirect('/products');
    })
    .catch(function(err){
      next(err);
    });
});

router.post('/', function(req, res, next){
  db.createProduct(req.body)
    .then(function(){
      res.redirect('/products');
    })
    .catch(function(err){
      next(err);
    });
});
