const express = require("express")
const { addSkill, deleteSkill, updateSkill, getAllSkill } = require("../controller/skills")
const { auth } = require("../middlewares/auth")




const router = express.Router()

router.post('/addSkill',auth,addSkill)
router.delete('/deleteSkill',auth,deleteSkill)
router.put('/updateSkill',auth,updateSkill)
router.get('/getAllSkills',getAllSkill)
module.exports = router