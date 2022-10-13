const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

//Make Model
const User = new mongoose.model("User", userSchema);

//Application Router
router.get("/", checkLogin, (req, res)=>{
    res.send("This is a data!")
    //console.log(req.username)
    //console.log(req.userId)
});

//Signup Router
router.post("/signup", async (req, res)=>{
    try{
        //bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            message: "Signup Successful!"
        });
    } catch {
        res.status(200).json({
            message: "Signup Faild!"
        });
    }
});

//Login Router
router.post("/login", async (req, res)=>{
    try {
        const user = await User.find({ username: req.body.username});
        if(user && user.length > 0){
            //compare password
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword){
                //generate jwt token
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id,
                }, process.env.JWT_SECRECT,{
                    expiresIn: '1h'
                });

                res.status(200).json({
                    "access-token": token,
                    "message": "Login successful!"
                });
            }
        } else{
            res.status(401).json({
                error: "Authentication failed!"
            });
        }
    } catch {
        res.status(401).json({
            message: "Login Faild!"
        });
    }
});

//Get All Users
router.get("/all", async (req, res)=>{
    try{
        const users = await User.find({})
        .populate("todos");
        res.status(200).json({
            result: users,
            message: "Successful!"
        });
    } catch(err){
        console.log(err)
        res.status(500).json({
            error: "There was a server site err!"
        });
    }
})


module.exports = router;