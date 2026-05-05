const PRODUCTS = require("../data/products");

function getProducts(category) {
  let list = PRODUCTS;

  if (category) {
    list = PRODUCTS.filter(p => p.category === category);
  }

  return { products: list };
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

module.exports = { getProducts, getProductById };