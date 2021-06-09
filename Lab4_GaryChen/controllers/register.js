const bcrypt = require('bcrypt')
const Users  = require('../models/User')


//GET request
function signupPage( req, res ) {
    res.render('register')
}

//POST request
async function signup( req, res ) {
    var first = req.body.first
    var last = req.body.last
    var email = req.body.email
    var birthday = new Date( req.body.birthday )
    var phone = req.body.phone
    const salt = await bcrypt.genSalt(10)
    var password = await bcrypt.hash(req.body.password, salt)

    var result = await Users.findOne({
        first: first, 
        last: last,
        email: email})

    console.log("HELLO")

    if( result ){ 
        //User already exsits/
        res.render('register', {err: "User already exists."})
    } else {
        //User doesn't exist, then sign them up!
        const newUser = new Users({
            first: first,
            last: last,
            email: email,
            birthday: birthday,
            phone: phone,
            password: password
        }).save( err => {
            if( err ){
                //Something went wrong while saving a new user
                console.log(`Something went wrong!!! ${err}`)
                res.redirect('/register')
            } else {
                //Successful saving
                req.session.email = email
                req.session.name = first
                console.log(`Success! Email: ${req.session.name} and name: ${req.session.name}`)
                res.redirect('/')
            }
        })
    }
}

function loginPage(req, res) {
    res.render('login')
}

module.exports = {
    signupPage,
    signup,
    loginPage
}