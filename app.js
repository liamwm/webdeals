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


const app = express()
const PORT = 3000 || process.env.PORT

app.set("view engine", "pug")
app.get("/", async (req, res) => {
  res.render("index")
})
app.get("/fetch", fetchController.getStuff)

const productsRouter = require("./routes/productsRouter.js")
app.use("/products", productsRouter)

app.listen(PORT, () => {
  console.log("App listening on port " + PORT)
})
