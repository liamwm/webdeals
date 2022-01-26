require('dotenv').config()
const express = require("express")

const mongoose = require("mongoose")
const { MongoClient } = require('mongodb');
const dbUser = encodeURIComponent(process.env.DB_USER)
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD)
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.zlnox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log("Connecting to " + uri)
mongoose.connect(uri, (err) => {if (err) {console.log(err)}})
mongoose.connection.on("error", (err) => console.log(err))

const fetchController = require("./fetch.js")

const Product = require("./models/product.js")


const app = express()
const PORT = 3000 || process.env.PORT

app.set("view engine", "pug")
app.get("/", async (req, res) => {
  const products = await Product.find({}).lean()
  console.log(typeof(products))
  res.render("index", {products: products})
})
app.get("/fetch", fetchController.getStuff)

app.listen(PORT, () => {
  console.log("App listening on port " + PORT)
})
