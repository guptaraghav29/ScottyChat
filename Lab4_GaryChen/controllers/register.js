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
                res.redirect('/')
            }
        })
    }
}

function loginPage(req, res) {
    res.render('login')
}

async function login(req, res) {
    var email = req.body.email
    var password = req.body.password

    var result = await Users.findOne({ email: email })
    if( result ){
        //User is found in the database. Then, log them in.
        console.log("Found a email in LOGIN")
        if( await bcrypt.compare( password, result.password )){
            req.session.email = result.email
            req.session.userID = result._id.toString()
            res.cookie('sessionUserId', result._id.toString())

            console.log( `resultID: ${result._id}`)
            console.log( `cookieID: ${req.cookies.sessionUserId}` )

            res.redirect('/')
        } else {
            res.redirect('login', { err: "Password or Email is invalid"})
        }
    } else {
        //User is not found in the database. 
        console.log("Didn't find a user in LOGIN")
        res.redirect('login', { err: "Password or Email is invalid"})
    }
}

module.exports = { 
    signupPage,
    signup,
    loginPage,
    login
}