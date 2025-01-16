const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { createSite, deployPortfolio } = require("../controller/deploy");





router.post("/deployPortfolio", auth , deployPortfolio);
router.post("/createSite",createSite)

module.exports = router;
