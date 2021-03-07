const mongoose = require('mongoose')
const dbConfig = require('./dbconfig')

const connectDB = async() => {
    try{
        const connections = await mongoose.connect(dbConfig.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('MongoDB Connected: ' + connections.connection.host)
    }

    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB