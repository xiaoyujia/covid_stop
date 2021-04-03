var User = require('../models/user')
var Location = require('../models/location')
var Status = require('../models/status')
var jwt = require('jwt-simple')
var crypto = require('crypto')
//var sign = require('jwt-encode')
var config = require('../config/dbconfig')
//const { token } = require('morgan')
var mongoose = require('mongoose')
var QRCode = require('qrcode')
var url = require('url')
const { time } = require('console')

var thestatus = 'yellow'



var functions = {
    addNewUser: function (req, res) {
        if((!req.body.name) || (!req.body.password)) {
            res.json({
                success: false,
                msg: 'Please fill all fields'
            })
        } else {
            var newUser = User({
                name: req.body.name,
                password: req.body.password
            });
            newUser.save(function(err, newUser) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Failed to save'
                    })
                } else {
                    res.json({
                        success: true,
                        msg: 'Successfully saved'
                    })
                }
            })
        }
    },
    authentication: function (req, res) {
        User.findOne({
            name: req.body.name
        },
        //fgfg
        function (err, user) {
            if (err) throw err
            if (!user) {
                res.status(403).send({
                    success: false,
                    msg: 'User not found'
                })
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.json({
                            success: true,
                            token: token
                        })
                    } else {
                        return res.status(403).send({
                            success: false,
                            msg: 'Wrong Password'
                        })
                    }

                })
            }
        })
    },
    getstatus: function (req, res) {
        //var encrypttoken = jwt.encode(req.body.token, config.secret)
        if(req.body.token != null) {
            Location.findOne({token: req.body.token}).then((result) => {
                res.send(result.status)

            }).catch((err) => {
                console.log(err);
            })
        } else {
            return res.json({
                success: false,
                msg: 'No Token'
            })
        }
    },

    locationUpdate: function (req, res) {
        if((!req.body.token) || (!req.body.latitude) || (!req.body.longitude) || (!req.body.time) || (!req.body.status)) {
            res.json({
                success: false,
                msg: 'Please fill all fields'
            })
        } else {
            
            thestatus = req.body.status;
            var newLocation = Location({
                token: req.body.token,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                time: req.body.time,
                status: req.body.status
            });
            newLocation.save(function(err, newLocation) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Failed to save'
                    })
                } else {
                    res.json({
                        success: true,
                        msg: 'Successfully saved'
                    })
                }
            })
            newLocation.save(newLocation)
        }
    },

    qrcode: function (req, res) {

        if((!req.body.token) || (!req.body.time)) {
            res.json({
                success: false,
                msg: 'Please fill all fields'
            })
        } else {
            var statustoken = crypto.randomBytes(16).toString('hex')
            var newStatus = Status({
                token: statustoken,
                status: thestatus,
                time: req.body.time,
                secret: req.body.token
            });
            newStatus.save(function(err, newStatus) {
                if (err) {
                    res.json({
                        success: false,
                        msg: err
                    })
                }/* else {
                    res.json({
                        success: true,
                        msg: 'Successfully saved'
                    })
                }*/
            })
            newStatus.save(newStatus);
            
            //https://covid-stop.herokuapp.com/getqr?token=***
            var urlObject = {
                protocol: 'https',
                slashes : true,
                host: 'covid-stop.herokuapp.com',
                pathname: '/getqr',
                search: 'token=' + statustoken,
            };
            var statusUrl = url.format(urlObject);
            console.log(statusUrl);

            QRCode.toDataURL(statusUrl, function (err, url) {
                if (err) {
                    res.send("Get Status Error")
                } else {
                    //console.log(url)
                    res.send(url)
                }
            })


        }
    },

    getqr: function (req,res) {
        token = req.query.token
        if(token != null) {
            Status.findOne({token: token}).then((result) => {
                res.send(result.status)

            }).catch((err) => {
                console.log(err);
            })
        } else {
            return res.json({
                success: false,
                msg: 'No Token'
            })
        }



    }


}

module.exports = functions