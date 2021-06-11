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
    var password = await bcrypt.hash(req.body.password, 10)

    var result = await Users.findOne({
        email: email,
        password: password
        })

    if( result ){ 
        //User already exsits/
        console.log("User already exists")
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
                console.log(`Success! Email: ${req.session.name} and name: ${req.session.name}`)
                res.redirect('/login')
            }
        })
    }
}

//GET request to render login page
function loginPage(req, res) {
    var fail = req.session.fail
    var warning = ""
    if( fail ){
        warning = "Invalid email or password."
    }
    
    res.render('login', { err: warning })
}

//POST request to authenticate user credentials
async function login(req, res) {
    var email = req.body.email
    var password = req.body.password

    var result = await Users.findOne({ email: email })
    if( result ){
        //User is found in the database. Then, log them in.
        if( await bcrypt.compare( password, result.password )){
            req.session.email = result.email
            req.session.userID = result._id.toString()
            res.cookie('sessionUserId', result._id.toString())
            res.redirect('/')
        } else {
            req.session.fail = true
            res.redirect('/login')
        }
    } else {
        //User is not found in the database. 
        req.session.fail = true
        res.redirect('/login', )
    }
}

function logout(req, res) {
    req.session.destroy( err => {
        req.session = null
        return res.redirect('/login')
    })
}

module.exports = { 
    signupPage,
    signup,
    loginPage,
    login,
    logout
}