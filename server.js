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

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
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

//View engine
app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: __dirname + '/views/layouts/',
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//All routes
app.get('/', homeHandler.getHome);
app.post('/create', roomHandler.createRoom);
app.post('/usernameSet', roomHandler.usernameSet);
app.get('/:roomName/messages', roomHandler.showAllMessage);
app.get('/:roomName', roomHandler.getRoom);

server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));