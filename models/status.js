var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var statusSchema = new Schema({
    token: {
        type: String,
        require: true
    },
    status: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    }

})

statusSchema.pre('save', function(next) {
    var status = this;
    
    if(this.isModified('time') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(status.secret, salt, function(err,hash) {
                if (err) {
                    return next(err)
                }
                status.secret = hash;
                next()
            })
        })
    } else {
        return next()
    }
})



module.exports = mongoose.model('Status', statusSchema)