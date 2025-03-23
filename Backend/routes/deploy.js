const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {  deployPortfolio, updatelink} = require("../controller/deploy");
const { uploadFolder } = require("../controller/UploadFolder");








router.post("/deployPortfolio", auth , deployPortfolio);
router.patch("/updatelink", auth , updatelink);
// router.post("/createSite",createSite)
router.post("/UploadZip", uploadFolder);

module.exports = router;
