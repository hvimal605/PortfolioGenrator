const express = require("express")
const app = express();
const userRoutes = require("./routes/user")
const templateRoutes = require("./routes/template")
const timelineRoutes = require("./routes/timeline")
const portfolioRoutes = require("./routes/portfolio")
const deployRoutes = require("./routes/deploy")
const skillRoutes = require("./routes/skills")
const projectRoutes = require("./routes/Project")
const softwareApplicationRoutes = require("./routes/softwareApplication")
const database = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require('cors')
const { cloudinaryConnect } = require('./config/cloudinary')
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
dotenv.config()

const Port = process.env.PORT || 4000


database.connect()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)

//cloudinary connection 
cloudinaryConnect()

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/template", templateRoutes)
app.use("/api/v1/timeline", timelineRoutes)
app.use("/api/v1/portfolio", portfolioRoutes)
app.use("/api/v1/skill", skillRoutes)
app.use("/api/v1/softwareApplication",softwareApplicationRoutes)
app.use("/api/v1/project",projectRoutes)
app.use("/api/v1/deploy",deployRoutes)


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
})

app.listen(Port, () => {
    console.log(`App is running at ${Port}`)
})

