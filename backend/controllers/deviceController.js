const Device = require('../models/deviceModel').Device;
const userController = require('./userController');

const getDeviceByIdentifier = async (identifier) => {
    let users = await userController.getAllUsers();

    let ret = null;

    users.forEach(user => {
        user.devices.forEach(dev => {
            if (dev.identifier === identifier) {
                ret = dev;
            }
        });
    });

    return ret;
}

const getUserDeviceByIdentifier = (user, identifier) => {
    let ret = null;

    user.devices.forEach(device => {
        if (device.identifier === identifier) {
            ret = device;
        }
    })    

    return ret;
}

const createDevice = (user, dev) => {

    if (!user || !dev || !dev.identifier || !dev.public_url || !dev.room || !dev.room.name
        || !dev.room.description || !dev.room.volume) 
    {
            return null;
    }

    let d = getUserDeviceByIdentifier(user, dev.identifier);
    
    if (d) return null;

    let newDev = new Device(dev);
    user.devices.push(newDev);

    user.save();
    return user;
}

const updateRoom = async (user, dev, room) => {
    let device = await getUserDeviceByIdentifier(user, dev.identifier);

    if (!dev) {
        return null;
    }

    device.room = {
        name: room.name,
        description: room.description,
        volume: room.volume
    };

    user.save();
    return user;
}

const updatePublicUrl = async (identifier, newUrl) => {
    let dev = await getDeviceByIdentifier(identifier);

    if (!dev) {
        return null;
    }

    dev.public_url = newUrl;
    dev.save();
    return dev;
}

module.exports.getDeviceByIdentifier = getDeviceByIdentifier;
module.exports.createDevice = createDevice;
module.exports.updateRoom = updateRoom;
module.exports.updatePublicUrl = updatePublicUrl; 
module.exports.getUserDeviceByIdentifier = getUserDeviceByIdentifier;