var User = require('../models/user')
var Location = require('../models/location')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { token } = require('morgan')

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
        var decodedtoken = jwt.decode(token, config.secret)
        if(req.body.token == decodedtoken) {
            var status = Location.findOne({token: token}).status
            
            return res.json({
                success: true,
                msg: status
            })
        } else {
            return res.json({
                success: false,
                msg: 'No Header'
            })
        }
    },

    locationUpdate: function (req, res) {
        if((!req.body.token)|| (!req.body.latitude) || (!req.body.longitude) || (!req.body.time) || (!req.body.status)) {
            res.json({
                success: false,
                msg: 'Please fill all fields'
            })
        } else {
            var newLocation = Location({
                token: req.body.token,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                time: req.body.time,
                status: req.body.status
            });
            newLocation.save(function(err, newUser) {
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
    }
}

module.exports = functions