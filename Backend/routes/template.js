
const express = require("express")
const { isAdmin, auth } = require("../middlewares/auth")
const { createNewTemplate, getAllTemplates, getTemplateById, deleteTemplate, toggleTemplateStatus, updateTemplate } = require("../controller/Template")
const router = express.Router()



router.post("/createTemplate", auth ,isAdmin, createNewTemplate)
router.get("/getAllTemplate", getAllTemplates)
router.get("/getTemplateById",getTemplateById)
router.delete("/deleteTemplate",auth , isAdmin, deleteTemplate)
router.post("/toggleTemplateStatus",auth , isAdmin , toggleTemplateStatus)
router.put("/updateTemplate",auth , isAdmin , updateTemplate)
module.exports = router