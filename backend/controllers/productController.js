const productService = require("../services/productService");

function getAll(req, res) {
  const { category } = req.query;
  const { products } = productService.getProducts(category);
  res.json(products);
}

function getOne(req, res) {
  const id = Number(req.params.id);
  const product = productService.getProductById(id);

  if (!product) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(product);
}

module.exports = { getAll, getOne };