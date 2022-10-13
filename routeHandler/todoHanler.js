const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");

//Make Model
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

//Save Data into the database
router.post("/", checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId,
    });
    try{
        const todo = await newTodo.save();
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        });
        res.status(200).json({
            message: "Data Insert Successfully!"
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            error: "There was a server site error!"
        });
    }
});

//Show data from database
router.get("/all", checkLogin, (req, res)=>{
    Todo.find({})
    .populate("user", "name username -_id")
    .exec((err, data)=>{
        if(err){
            res.status(500).json({
                error: "There was a server site err!"
            });
        }else{
            res.status(200).json({
                result: data,
                message: "Successful!"
            });
        }
    })
})

module.exports = router