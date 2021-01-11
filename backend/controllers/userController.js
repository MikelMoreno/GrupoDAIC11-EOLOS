const User = require('../models/userModel').User;

const getAllUsers = () => {
    let promise = User
    .find()
    .select('-__v')
    .exec();

    return promise;
}

const getUserByEmail = (email) => {
    let promise = User
    .find()
    .findOne({email: email})
    .select('-__v')
    .exec()

    return promise;
}

const getUserById = (id) => {
    let promise = User
        .findById(id)
        .select('-__v')
        // .populate('wallets')
        .exec()

    return promise;
}

// nuevo (no lo tiene mikel)
const getUserByDeviceID = async (identifier) => {
    let users = await getAllUsers();
    let ret = null;
    users.forEach(user => {
        user.devices.forEach(dev => {
            if (dev.identifier === identifier) {
                ret = user;
            }
        });
    });

    return ret;
}

// callback params -> (err, createdUser)
const createUser = async (email, password) => {
    let user = await getUserByEmail(email);

    if (!user) {
        let newUser = new User({
            email: email,
            password: password,
            devices: []
        });

        newUser.save();
        return newUser;
    }

    return null;
}


module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;
module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getUserByDeviceID = getUserByDeviceID;