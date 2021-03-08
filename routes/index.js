const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('COVID STOP Server App')
})

//add new user

//router.post('/addnew', function(req, res){
 //   actions.addNewUser
//});

router.post('/addnew', actions.addNewUser)

//user auhentication
router.post('/auth', actions.authentication)

//get health status on a user
router.post('/getstatus', actions.getstatus)


module.exports = router