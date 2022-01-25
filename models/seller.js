const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
  name: String,
  url: String
})

const sellerModel = mongoose.Model("Seller", sellerSchema)
module.exports = sellerModel
