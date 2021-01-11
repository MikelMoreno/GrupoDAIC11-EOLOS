var express = require('express');
var router = express.Router();

const uuid = require('uuid').v4;

const deviceController = require('../controllers/deviceController');
const userController = require('../controllers/userController');
const genericError = require('../errorHandlers/genericError').genericError;
const fetch = require("node-fetch");


router.post('/device/create', (req, res, next) => {
    let device = req.body.device;
    if (device) {
        let user = deviceController.createDevice(req.user, device);

        if (!user) {
            return genericError({
                message: "Could not create device"
            }, req, res, next);
        }

        return res.json({
            user: user
        })
    }

    console.log("there is no device")

    return genericError({
        message: "A device must be provided"
    }, req, res, next);
});

/**
 * Actualizar la room de un usuario
 */
router.post('/device/update/room', async (req, res, next) => {
    console.log("about to update room")
    let device = req.body.device;
    if (device) {
        let user = await deviceController.updateRoom(req.user, device, device.room); //modificar el device

        if (!user) {
            return genericError({
                message: "Could not update device"
            }, req, res, next);
        }

        return res.json({
            user: user
        })
    }

    console.log("there is no device")

    return genericError({
        message: "A device must be provided"
    }, req, res, next);
});

/**
 * Devuelve un device
 */
router.post('/device/get', async (req, res, next) => {
    let identifier = req.body.identifier;
    if (identifier) {
        let device = await deviceController.getDeviceByIdentifier(identifier); //devuelve el device

        if (!device) {
            return genericError({
                message: "Could not retrieve device"
            }, req, res, next);
        }

        return res.json({
            device: device
        })
    }

    return genericError({
        message: "A device must be provided"
    }, req, res, next);
});

// esto unicamente se llama desde las rasps
router.post('/deviceurl', async (req, res, next) => {
    let deviceID = req.body.identifier;
    let publicURL = req.body.tunnel_url;

    if (!deviceID || !publicURL) {
        return res.json({
            error: "Missing fields"
        });
    }

    let owner = await userController.getUserByDeviceID(deviceID);

    if (!owner) {
        return res.json({
            error: "Device not found"
        })
    }

    let device = null;
    owner.devices.forEach(dev => {
        if (dev.identifier === deviceID) {
            device = dev;
        }
    })

    if (!device) {
        return res.json({
            error: "Device not found"
        });
    }

    device.public_url = publicURL;

    for (let i = 0; i < owner.devices.length; i++) {
        if (owner.devices[i].identifier === deviceID) {
            owner.devices[i] = device;
        }
    }

    owner.save();

    res.json({
        success: true
    });
})

//intermediarios de rasp y front
/**
 * Modifica el json de la rasp
 */
router.post('/device/params/edit', async (req, res, next) => {
    const { deviceID, TES, TEM, MAXGAS, MAXHCHO } = req.body;

    if (!req.user) {
        return genericError({
            message: "Unauthenticated user"
        }, req, res, next);
    }

    let device = deviceController.getUserDeviceByIdentifier(req.user, deviceID);

    if (!device) {
        return genericError({
            message: "Device does not exist"
        }, req, res, next);
    }

    let device_url = device.public_url;

    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            TES: TES,
            TEM: TEM,
            MAXGAS: MAXGAS,
            MAXHCHO: MAXHCHO
        })
    };

    try {
        let response = await fetch(device_url + "/edit", requestOptions);
        response = await response.json();
        return res.json(response)
    } catch (e) {
        return genericError({
            message: "Could not contact device"
        }, req, res, next);
    }
});

/**
 * Devuelve el json de la rasp
 */
router.post('/device/params/get', async (req, res, next) => {
    const { deviceID } = req.body;

    if (!req.user) {
        return genericError({
            message: "Unauthenticated user"
        }, req, res, next);
    }

    let device = deviceController.getUserDeviceByIdentifier(req.user, deviceID);

    if (!device) {
        return genericError({
            message: "Device does not exist"
        }, req, res, next);
    }

    let device_url = device.public_url;
    console.log("agains: "+device_url)

    let requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        let response = await fetch(device_url + "/get", requestOptions);
        response = await response.json();
        return res.json(response);
    } catch (e) {
        return genericError({
            message: "Could not contact device"
        }, req, res, next);
    }
});

module.exports = router;
