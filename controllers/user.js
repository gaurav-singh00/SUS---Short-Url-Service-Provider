const User = require("../models/user");
const {v4: uuidv4} = require("uuid");
const {setUser, getUser} = require('../services/Auth');
const mongoose = require("mongoose");

async function handleSignup (req, res) {
    const {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.render("home");
}

async function handleLogin (req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email, password});
    if(!user) return res.render("login", {
        error: "Invalid Email or Password"
    });

    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
}

module.exports = {
    handleSignup,
    handleLogin,
}