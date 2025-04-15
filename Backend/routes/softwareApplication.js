const express = require("express")
const { addNewApplication, deleteApplication, getAllSoftwareApplication, updateSoftwareApp } = require("../controller/softwareApplication")
const { auth } = require("../middlewares/auth")



const router = express.Router()

router.post('/addsoftwareApplication',auth,addNewApplication)
router.delete('/deletesoftwareApplication',auth,deleteApplication)
router.get('/getAllSoftwareApplication',getAllSoftwareApplication)
router.put('/updateSoftwareApplication',auth , updateSoftwareApp)
module.exports = router