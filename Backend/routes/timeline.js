const express = require("express")
const { auth } = require("../middlewares/auth")
const { createTimeline, deleteTimeline, getAllTimeline } = require("../controller/timeline")



const router = express.Router()

router.post('/createTimeline',auth, createTimeline)
router.delete('/deleteTimeline',auth,deleteTimeline) 
router.get('/getAllTimeline',getAllTimeline) 

module.exports = router