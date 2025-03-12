const express = require("express");
const mongoose = require("mongoose");
const User = require("./UserModel");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

// const PORT = process.env.PORT;
// const DB_USER = process.env.DB_USER;
// const DB_PW = process.env.DB_PW;
// const DB_NAME = process.env.DB_NAME;

const mongoURI = `mongodb+srv://${DB_USER}:${DB_PW}@cluster0.0gxs4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// establishing connection with the mongodb database
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB!'))
.catch(error => console.error('MongoDB connection error:', error));

app.post("/users/new", async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) {
            res.status(400).json({message: "User already exists"});
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({message: "User created", ...newUser._doc});
    } catch(error) {
        if(error.name === "ValidationError") {
            res.status(400).json({message: "Enter valid details"});
        } else {
            res.status(400).json(error.message);
        }
    }
});

app.get("/users/all", async(req, res) => {
    try {
        const user = await User.find(); // returns an array of users
        if(user.length > 0) {
            res.status(200).json({message: `${user.length} users found`, users: user});
        } else {
            res.status(200).json({message: "0 users found"});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/users/:email", async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email}); // finds the first document with the given attribute(s) match
        if(user) {
            res.status(200).json({message: "Match Found", ...user._doc});
        } else {
            res.status(404).json({message: "User Not Found"});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put("/users/:email", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({email: req.params.email}, req.body, {new: true}); // finds the first document with the given attribute(s) match and updates
        res.status(200).json({message: "User Updated", ...user._doc});
    } catch(error) {
        res.status(404).json({message: "No such user exists"});
    }
});

app.delete("/users/:email", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({email: req.params.email});    // finds the first document with the given attributes(s) match and deletes the matching document
        res.status(200).json({message: "User Deleted"});
    } catch(error) {
        res.status(404).json({message: "No such user exists"});
    }
});

app.get("/", (req, res) => {
    res.send("User Manager Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});