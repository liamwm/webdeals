const express = require("express")
const mongoose = require("mongoose")

const fetchController = require("./fetch.js")



const app = express()
const PORT = 3000 || process.env.PORT


app.get("/", async (req, res) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log("connected")
  } catch (err) {
    console.log(err)
  }
})
app.get("/fetch", fetchController.getStuff)

app.listen(PORT, () => {
  console.log("App listening on port " + PORT)
})
