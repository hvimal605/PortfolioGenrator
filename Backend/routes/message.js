const express = require("express")
const { sendMessage, getMessagesByPortfolioId, deleteMessageByIdForPortfolio, toggleEmailNotifications } = require("../controller/message")
const { auth } = require("../middlewares/auth")




const router = express.Router()
router.post('/sendMessage' , sendMessage)
router.post('/getAllMessages',auth,getMessagesByPortfolioId)
router.delete('/deleteMessage',auth , deleteMessageByIdForPortfolio)
router.post("/toggleEmailNotification",auth , toggleEmailNotifications)

module.exports = router