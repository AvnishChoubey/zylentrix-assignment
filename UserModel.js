const mongoose = require("mongoose");
const {isEmail} = require("validator");

const UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        index: true, 
        validate: isEmail},
    name: {type: String, required: true}, 
    age: {type: Number, required: true},
}, {timestamps: true});

// UserSchema.pre('findOneAndUpdate', function(next) {
//     const update = this.getUpdate();
//     if(update.email) {
//         return next(new Error("Email cannot be updated"));
//     }
//     next();
// });

const User = mongoose.model("User", UserSchema);

module.exports = User;