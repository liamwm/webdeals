const mongoose = require("mongoose")
const atlas = require("mongoose-atlas-search")

const productSchema = new mongoose.Schema({
  name: String,
  price: {type: String},
  img: {type: String},
  url: {type: String},
  description: String
})

const productModel = mongoose.model("Product", productSchema)

atlas.initialize({
  model: productModel,
  overwriteFind: true,
  searchKey: 'search',
  searchFunction: (query) => {return {
    index: 'default',
    text: {
      query: query,
      path: {
        'wildcard': '*'
      },
      fuzzy: {}
    }
  }}
});

module.exports = productModel
