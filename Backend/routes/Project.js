const express = require("express")
const { auth } = require("../middlewares/auth")
const { addNewProject, deleteProject, upadteProject, getAllProject, getSingleProject } = require("../controller/project")





const router = express.Router()

router.post('/addProject',auth,addNewProject)
router.delete('/deleteProject',auth,deleteProject )
router.put('/updateProject',auth,upadteProject)
router.get('/getAllProject',getAllProject)
router.post('/getSingleProject',getSingleProject)

module.exports = router