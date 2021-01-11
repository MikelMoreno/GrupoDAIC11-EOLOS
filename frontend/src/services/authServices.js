const cloud_url = require('../config').config.cloud_url;

const requestSignup = (username, email, password, repassword, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password,
            repassword: repassword
        })
    };

    fetch(cloud_url + "/auth/signup", requestOptions)
        .then(res => res.json()) 
        .then((res) => {
            callback(res);
    });
}

const requestLogin = (email, password, callback) => {
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    };

    fetch(cloud_url + "/auth/login", requestOptions)
        .then(res => res.json()) 
        .then((res) => {
            callback(res);
        })
}

const requestWhoami = (callback) => {
    fetch(cloud_url + "/auth/whoami", {credentials: 'include'})
        .then(res => res.json())
        .then((res) => { callback(res) });
}


const requestLogout = (callback) => {
    fetch(cloud_url + "/auth/logout", {credentials: 'include'})
        .then(res => res.json())
        .then((res) => { callback(res) });
}

module.exports.requestSignup = requestSignup;
module.exports.requestLogin = requestLogin;
module.exports.requestWhoami = requestWhoami;
module.exports.requestLogout = requestLogout;