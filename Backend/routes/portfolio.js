
const express = require("express")
const { auth } = require("../middlewares/auth")
const { createPortfolio, addPortfolioDetails, getPortfolioDetailsById } = require("../controller/Portfolio")

const router = express.Router()





router.post("/createPortfolio",auth, createPortfolio)
router.post("/addPortfolioDetails",auth, addPortfolioDetails)
router.post("/getPortfolioFullDetails", getPortfolioDetailsById)

module.exports = router