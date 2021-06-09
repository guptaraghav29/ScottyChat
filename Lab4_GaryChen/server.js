// By Gary Chen

// import dependencies
const express   = require('express');
const app       = express();
const server    = require('http').createServer(app)

 //Setting the Socket.io object to be global so I can use it in room.js file
global.io       = require('socket.io')(server)      

const cookieParser = require('cookie-parser');
const hbs       = require('express-handlebars');
const path      = require('path');
const config    = require('config')
const mongoose  = require('mongoose')
const session   = require('express-session')

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const registerHandler = require('./controllers/register.js');

const db = config.get('mongoURI')

mongoose   
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then( () => console.log("Connected to MongoDB"))
    .catch( err => console.error(err))

const port = 8080;

app.use(express.json());
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

//All routes
app.get('/', redirectRegister, homeHandler.getHome);
app.post('/create', roomHandler.createRoom);

app.get('/register', redirectHome, registerHandler.signupPage)
app.post('/register', registerHandler.signup)

app.get('/login', redirectHome, registerHandler.loginPage)
app.post('/login', redirectHome, registerHandler.login)

//We can delete this b/c only users who signed up can use the chatroom, so we don't need to check if they entered a username
// app.post('/usernameSet', roomHandler.usernameSet); 

app.get('/:roomName/messages', roomHandler.showAllMessage);
app.get('/:roomName', roomHandler.getRoom);

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));