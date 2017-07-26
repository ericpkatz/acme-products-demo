var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err){
  if(err){
    console.log(err.message);
  }
});

function sync(cb){
  var sql = `
    DROP TABLE IF EXISTS products;
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE
    );
  `;
  query(sql, null, function(err){
    if(err){
      return cb(err);
    }
    cb(null);
  });
}

function query(sql, params, cb){
  client.query(sql, params, cb);
}

function createProduct(product, cb){
  query('insert into products (name) values ($1) returning id', [ product.name ], function(err, result){
    if(err){
      return cb(err);
    }
    cb(null, result.rows[0].id); 
  }); 
}

function deleteProduct(id, cb){
  client.query('delete from products where id = $1', [ id ], function(err, result){
    if(err){
      return cb(err);
    }
    cb(null); 
  }); 
}

function getProducts(cb){
  query('select * from products', null, function(err, result){
    if(err){
      return cb(err);
    }
    cb(null, result.rows);
  });
}

function seed(cb){
  createProduct({ name: 'foo'}, function(err, id){
    if(err){
      return cb(err);
    }
    createProduct({ name: 'bar'}, function(err, id){
      if(err){
        return cb(err);
      }
      createProduct({ name: 'bazz'}, function(err, id){
        if(err){
          return cb(err);
        }
        cb(null);
      });
    });
  });

}

module.exports = {
  sync,
  seed,
  getProducts,
  createProduct,
  deleteProduct
};
