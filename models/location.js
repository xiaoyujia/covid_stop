var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var locationSchema = new Schema({
    token: {
        type: String,
        require: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

locationSchema.pre('save', function(next) {
    var token = this;
    
    if(this.isModified('time') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(token.time, salt, function(err,hash) {
                if (err) {
                    return next(err)
                }
                token.time = hash;
                next()
            })
        })
    } else {
        return next()
    }
})



module.exports = mongoose.model('Location', locationSchema)