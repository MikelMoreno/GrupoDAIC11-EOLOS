const cloud_url = require('../config').config.cloud_url;

/**
 * Mofifica el valor 'room' del device seleccionado
 * @param {*} identifier 
 * @param {*} public_url 
 * @param {*} name 
 * @param {*} description 
 * @param {*} volume 
 * @param {*} grafana_panels 
 * @param {*} callback 
 */
const requestEditRoom = (updatedDevice, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            device: updatedDevice
        })
    };

    fetch(cloud_url + "/api/device/update/room", requestOptions)
        .then(res => res.json())
        .then((res) => {
            callback(res);
        });
}

/**
 * Crea un device con los datos de entrada
 * @param {*} identifier 
 * @param {*} public_url 
 * @param {*} name 
 * @param {*} description 
 * @param {*} volume 
 * @param {*} grafana_panels 
 * @param {*} callback 
 */
const requestCreateDevice = (identifier, public_url, name, description, volume, grafana_panels, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            device: {
                identifier: identifier,
                public_url: public_url,
                room: {
                    name: name,
                    description: description,
                    volume: volume
                },
                grafana_panels: grafana_panels
            }
        })
    };

    //direccion de la 'nube'
    fetch(cloud_url + "/api/device/create", requestOptions)
        .then(res => res.json())
        .then((res) => {
            callback(res);
        });
}

/**
 * devuelve los valores del identifier indicado
 * @param {*} identifier 
 * @param {*} callback 
 */
const requestGetDevice = (identifier, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identifier: identifier
        })
    };

    //direccion de la 'nube'
    fetch(cloud_url + "/api/device/get", requestOptions)
        .then(res => res.json())
        .then((res) => {
            callback(res);
        });
}


/**
 * devuelve los valores del json de la rasp
 * @param {*} identifier 
 * @param {*} callback 
 */
const requestGetParams = (identifier, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceID: identifier
        })
    };

    //direccion de la 'nube'
    fetch(cloud_url + "/api/device/params/get", requestOptions)
        .then(res => res.json())
        .then((res) => {
            callback(res);
        });
}

const requestEditParams = (identifier, TES, TEM, MAXGAS, MAXHCHO, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceID: identifier,
            TES: TES,
            TEM: TEM,
            MAXGAS: MAXGAS,
            MAXHCHO: MAXHCHO
        })
    };

    //direccion de la 'nube'
    fetch(cloud_url + "/api/device/params/edit", requestOptions)
        .then(res => res.json())
        .then((res) => {
            callback(res);
        });
}

module.exports.requestEditRoom = requestEditRoom;
module.exports.requestCreateDevice = requestCreateDevice;
module.exports.requestGetDevice = requestGetDevice;
module.exports.requestGetParams = requestGetParams;
module.exports.requestEditParams = requestEditParams;