var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err){
  if(err){
    console.log(err.message);
  }
});

function sync(){
  var sql = `
    DROP TABLE IF EXISTS products;
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE
    );
  `;
  return query(sql);
}

function query(sql, params){
  return new Promise(function(resolve, reject){
    client.query(sql, params, function(err, result){
      if(err){
        return reject(err);
      }
      resolve(result);
    });
  });
}

function createProduct(product){
  return query('insert into products (name) values ($1) returning id', [ product.name ])
    .then(function(result){
      return result.rows[0].id;
    });
}

function deleteProduct(id){
  return query('DELETE FROM products WHERE id = $1', [ id ]);
}

function getProducts(){
  return query('select * from products', null)
    .then(function(result){
      return result.rows;
    });
}

function seed(){
  return Promise.all([
    createProduct({ name: 'foo'}),
    createProduct({ name: 'bar'}),
    createProduct({ name: 'bazz'}),
  ])
  .then(function(result){
    console.log(result);
  });
}

module.exports = {
  sync,
  seed,
  getProducts,
  createProduct,
  deleteProduct
};
