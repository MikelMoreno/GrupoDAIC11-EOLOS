const DeviceSchema = require('./deviceModel').DeviceSchema;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,       
    devices: [ DeviceSchema ]
});

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.UserSchema = userSchema;