
const express = require("express")
const { auth, isAdmin } = require("../middlewares/auth")
const { createPortfolio, addPortfolioDetails, getPortfolioDetailsById, getPortfolioBySlug, getPortfoliosForUser, trackVisitofPortfolio, getVisitorStats, getallstats, getMonthlyUserDeveloperPortfolioStats } = require("../controller/Portfolio")

const router = express.Router()





router.post("/createPortfolio",auth, createPortfolio)
// router.post("/addPortfolioDetails",auth, addPortfolioDetails)
router.post("/getPortfolioFullDetails", getPortfolioDetailsById)
router.post("/portfoliodetailsBySlug", getPortfolioBySlug); 
router.get("/portfoliosForUser",auth , getPortfoliosForUser); 
router.post('/trackvisitofPortfolio', trackVisitofPortfolio);
router.post('/getPortfolioVisitorStats',auth , getVisitorStats);
router.get("/getallstats",auth , isAdmin , getallstats)
router.get("/getMonthlyStats" , auth ,isAdmin , getMonthlyUserDeveloperPortfolioStats)

module.exports = router