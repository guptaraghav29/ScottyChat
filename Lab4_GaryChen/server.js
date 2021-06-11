// By Gary Chen

// import dependencies
const express   = require('express');
const app       = express();
const server    = require('http').createServer(app);

 //Setting the Socket.io object to be global so I can use it in room.js file
global.io       = require('socket.io')(server)      

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const hbs       = require('express-handlebars');
const path      = require('path');

const session   = require('express-session')
const config    = require('config');
const mongoose  = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET="jsdjfsjfksdfjhsdjfhdsfkjsdhf87879837937987*&&%^$%$^&^&^&^ksjhfkdhfksdhkfjhdskfjhdsk";

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const registerHandler = require('./controllers/register.js');
const { forgotPassword } = require('./controllers/register.js');

const db = config.get('mongoURI')

mongoose   
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then( () => console.log("Connected to MongoDB"))
    .catch( err => console.error(err))

const port = 8080;

app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: config.get('TOP-SECRET'),
    resave: false,
    saveUninitialized: false
}))

//View engine
app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: __dirname + '/views/layouts/',
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Middleware: Check if the user is logged in
const redirectRegister = (req, res, next) => {
    if( req.session.email ){
        next()
    } else {
        console.log("NOT HERE")
        res.redirect('/register')
    }
}
//Middleware: Check if the user is logged out
const redirectHome = (req, res, next) => {
    if( req.session.email ){
        res.redirect('/')
    } else {
        next()   
    }
}

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	//console.log(req.body);

	const {username, password: plainTextPassword } = req.body

	if(!username || typeof username !== 'string'){
		return res.json({status:"error", error:"Invalid username"})
	}

	if(!plainTextPassword || typeof plainTextPassword !== "string") {
		return res.json({status:"error", error:"Invalid password"})
	}
	if (plainTextPassword.length < 4 ) {
		return res.json({status:"error", error:"Password is too short"})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	// create the user 
	try{
		await User.create({
			username,
			password
		})
	}catch(error) {
		console.log(error)
		return res.json({status:"error"})
	}
})


///All routes
app.get('/', redirectRegister, homeHandler.getHome);
app.post('/create', roomHandler.createRoom);

app.get('/register', redirectHome, registerHandler.signupPage)
app.post('/register', registerHandler.signup)

app.get('/login', redirectHome, registerHandler.loginPage)
app.post('/login', redirectHome, registerHandler.login)
app.post('/logout', registerHandler.logout)

app.get('/forgotPassword', redirectHome, registerHandler.forgotPassword)
app.post('/changePassword', registerHandler.changePassword)

//We can delete this b/c only users who signed up can use the chatroom, so we don't need to check if they entered a username
// app.post('/usernameSet', roomHandler.usernameSet); 

app.get('/:roomName/messages', roomHandler.showAllMessage);
app.get('/:roomName', roomHandler.getRoom);

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));