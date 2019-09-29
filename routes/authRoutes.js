var fs = require('fs');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

let io;
const privateKey = fs.readFileSync('private.key').toString('base64')

router.post('/login', (req, res) => {

    User.authenticate(req.body.username, req.body.password, function (error, user) {

        if (error || !user) {
        err('Wrong email or password.')
        } else {
            redirect(res, req.body.username)
        }
    });  
})

router.post('/signup', (req, res) => {

    if (req.body.password !== req.body.passwordConf) {
        err.status = 400;
        err('Passwords do not match.')
    }

    var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    }

    User.create(userData, function (error, user) {
    if (error) {
        switch(error.code){
            case 11000:
                err('User already exists')
                break
            default:
                console.log(error)
                err('Sign up failed, try again later')
                break
        }
    } else {
        redirect(res, userData.username)
    }
    });

})

function err(msg){
    io.emit('error', { error: msg });
}

function redirect(res, username){
    var token = jwt.sign({ name: 'BWP', iat: 1569709318 }, privateKey, { algorithm: 'HS256'});

    console.log(token, privateKey);
    res.cookie('XSRF-TOKEN', token);
    console.log(jwt.verify(token, privateKey));
    return res.redirect('https://mammon.trade');

}

module.exports = function(socketio){
    io = socketio
    return router
}
