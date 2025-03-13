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


// create a new user
app.post("/users/new", async(req, res) => {
    try {
        // check if any user with given already exists
        const user = await User.findOne({email: req.body.email});
        // If the user was not found
        if(user) {
            res.status(400).json({message: "User already exists"});
        }
        // If the user was not found and created successfully
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({message: "User created", ...newUser._doc});
    } catch(error) {
        // If the email, name or age throw validation errors
        if(error.name === "ValidationError") {
            res.status(400).json({message: "Enter valid details"});
        } else {
            console.error("Error creating the user:", error); // Logging the error
            res.status(500).json({message: "An error occurred while creating user."});
        }
    }
});

// get all users information
app.get("/users/all", async(req, res) => {
    try {
        const user = await User.find(); // returns an array of users
        if(user.length > 0) {
            res.status(200).json({message: `${user.length} users found`, users: user});
        } else {
            res.status(200).json({message: "0 users found"});
        }
    } catch (error) {
        console.error("Error fetching users:", error); // Logging the error
        res.status(500).json({message: "An error occurred while fetching users."});
    }
});

// get a unique user using the email address
app.get("/users/:email", async (req, res) => {
    try {
        // find the first user with the given email
        const user = await User.findOne({email: req.params.email}); 
        if(user) {
            res.status(200).json(...user._doc);
        } else {
            res.status(404).json({message: "User Not Found"});
        }
    } catch (error) {
        console.error("Error fetching the user:", error); // Logging the error
        res.status(500).json({message: "An error occurred while fetching user."});
    }
});

// update a user using the email address
app.put("/users/:email", async (req, res) => {
    try {
        // find the first document with the given email
        const user = await User.findOneAndUpdate(
            {email: req.params.email}, 
            req.body, 
            {new: true, runValidators: true});
            // If the user was not found
            if(!user) {
                res.status(404).json({message: "No such user exists"});
            }
            // If the user was found and updated successfully 
            res.status(200).json({message: "User Updated", ...user._doc});
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: error.message });
        }
        // Error occur when tried to update the email
        else if (error.message === 'Email cannot be updated') {
            res.status(400).json({ message: error.message });
        }
        // Handle other errors
        else {
            console.error("Error updating the user:", error); // Logging the error
            res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
        }
    }
});

// delete a user using the email address
app.delete("/users/:email", async (req, res) => {
    try {
        // find the first user with the given email and delete the user
        const user = await User.findOneAndDelete({email: req.params.email});
        // Check if the user was found and deleted
        if (!user) {
            return res.status(404).json({ message: "No such user exists" });
        }    
        res.status(204).json({message: `User ${email} deleted successfully`});
    } catch(error) {
        console.error("Error deleting the user:", error); // Log the error
        return res.status(500).json({message: "An error occurred while deleting the user."});

    }
});

app.get("/", (req, res) => {
    res.send("User Manager Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});