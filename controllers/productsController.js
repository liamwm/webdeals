const mongoose = require("mongoose")

const Product = require("../models/product.js")


const getProducts = async (req, res) => {
  let products = null

  const query = req.query.query
  console.log(query)
  if (query) {
    products = await Product.find({search: query})
    console.log(products)
  } else {
    products = await Product.find({}).lean()
  }

  res.render("products", {products: products, searchValue: query})


}

const searchProducts = async (req, res) => {
  const results =
  console.log(req.params.query)
}



module.exports = {getProducts, searchProducts}
