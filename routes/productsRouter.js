const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

const Product = require("../models/product.js")

router.get("/", async (req, res) => {
  const products = await Product.find({}).lean()
  console.log(typeof(products))
  res.render("products", {products: products})
})

module.exports = router
