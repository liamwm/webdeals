const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  link: String,
  seller: {
    type: Schema.Types.ObjectID,
    ref: "Seller"
  }
})

const productModel = mongoose.Model("Product", productSchema)
module.exports = productModel
