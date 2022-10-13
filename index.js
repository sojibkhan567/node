const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userHandler = require("./routeHandler/userHandler");
const todoHandler = require("./routeHandler/todoHanler");


const app = express();
app.use(express.json());

//dotenv
dotenv.config();

//Database connection with mongoose
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log("Conection successful!"))
    .catch(err => console.log(err))
 
//Application Route
app.use("/todo", todoHandler);
app.use("/user", userHandler);


//Default error handler
const errorHandler = (err, req, res, next)=> {
    if (res.headerSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

//Server
app.listen(3000, () => {
    console.log("Server run on port: 3000");
})