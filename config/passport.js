var jwtStrategy = require('passport-jwt').Strategy
var jwtExtract = require('passport-jwt').ExtractJwt

var User = require('../models/user')
var config = require('./dbconfig')

module.exports = function(passport) {
    var opts = {}

    opts.secretOrKey = config.secret
    opts.jwtFromRequest = jwtExtract.fromAuthHeaderWithScheme('jwt')

    passport.use(new jwtStrategy(opts, function (jwtPayload, done) {
        User.find({
            id: jwtPayload.id
        },
        function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))
}