const { json } = require("body-parser");

const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

const filterPassword = (user) => {
    let copy = deepCopy(user);
    delete copy.password;
    return copy;
} 

module.exports.filterPassword = filterPassword;