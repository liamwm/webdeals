const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  url: String,
  description: String
})

const productModel = mongoose.model("Product", productSchema)
module.exports = productModel
