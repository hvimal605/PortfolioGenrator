const express = require("express")
const { addNewApplication, deleteApplication, getAllSoftwareApplication } = require("../controller/softwareApplication")
const { auth } = require("../middlewares/auth")



const router = express.Router()

router.post('/addsoftwareApplication',auth,addNewApplication)
router.delete('/deletesoftwareApplication',auth,deleteApplication)
router.get('/getAllSoftwareApplication',getAllSoftwareApplication)

module.exports = router