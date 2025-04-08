const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {   updatelink,  deployPortfolio,} = require("../controller/deploy");










router.post("/deployPortfolio", auth , deployPortfolio );
router.patch("/updatelink", auth , updatelink);
// router.post("/createSite",auth , createSite)


module.exports = router;
