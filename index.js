const express = require("express");
const mongoose = require("mongoose");
const { connectMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const {checkForAuthorization, restrictTo} = require("./middlewares/auth");


const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoutes");
const userRoute = require("./routes/user");

connectMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=> console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthorization);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get('/:shortId',async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        },
    );
    try {
        res.redirect(entry.redirectUrl);
    } catch (error) {
        return null;
    }
});

app.listen(8000, ()=> console.log("Server Started"));