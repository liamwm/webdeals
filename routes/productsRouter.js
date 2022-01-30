const express = require("express")


const productsController = require("../controllers/productsController.js")

const router = express.Router()



router.get("/", productsController.getProducts)
//router.get("?query=:query", productsController.searchProducts)


module.exports = router
