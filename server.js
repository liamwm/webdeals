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

const readline = require('readline')

const fetch = require("./fetch.js")


const app = express()
const PORT = 3000 || process.env.PORT

app.set("view engine", "pug")
app.get("/", async (req, res) => {
  res.render("home")
})

const productsRouter = require("./routes/productsRouter.js")
app.use("/products", productsRouter)

app.listen(PORT, () => {
  console.log("App listening on port " + PORT)
}, async (err) => {
  if (err) throw err;

  const rl = readline.createInterface(process.stdin, process.stdout);
  console.log("\nWebDeals Scraper CLI")
  rl.on('line', async (input) => {
    switch (input) {
      case "help":
        // display help text
        break;
      case "scrape":
        await fetch.getStuff()
        break;
    }
  })


})


// Scraper CLI
