# Welcome to ScottyChat!

Hi! Welcome to ScottyChat! This project is for "CS110: Intro to Web Development" which is a class at the University of California, Riverside. ScottyChat is a website where a user can create an account, log in, and start chatting. Users can create new chat rooms in addition to joining existing ones and start chatting with other users. This is an excellent platform to stay connected with ones you love in a safe, secure, and fun environment!


## How To Start This Project

- Clone this repository: `git clone https://github.com/CS-UCR/final_project-ccgr.git`
- Navigate to ScottyChat directory: `cd ScottyChat`
- Install packages: `npm install` 
- Navigate to `config/default.json` and paste your own MongoDB access link.
- Start the server: `npm start`
- Go to the server URL: `http://localhost:8080` and you will be prompted to the register page.
- Make an account and *voilà*, you can start browsing the chatrooms and create chatrooms yourself! **Have fun!**

## Documentation 

**server.js**
- This is the main file where we set up our ScottyChat sever routings
- Libraries that we are using: 
	- Express
	- Express-Session
	- Express-Cookie
	- Express-Handlebar
	- Bcrypt
	- Socket.IO
	- Mongoose

**controllers/home.js** 
- This is the server side logic for this `/` route, which is the homepage of ScottyChat
	- `getHome()`: renders the homepage, where you can join/create chatrooms and logout
	- When clicking on the "Create New Chatroom" button, a POST request will be triggered and handled in **controllers/room.js**.

**controllers/room.js**  
- This is the server side logic for this `/:roomName` route, which includes sending/receiving messages and joining existing chatroom.
	- `getRoom()`: grabs the `roomName` property from the URL and sends it to the database to check whether this room has been created. If it has been created, then it renders the appropriate room and messages; if it has not been created, it will render an error page.
	- `createRoom()`: creates a new chatroom, with a random name provided by `roomIdGenerator()` from the folder `util/roomIdGenerator.js` and store the newly created room in the database. Then, redirect the user to this new room.
	- `showAllMessages()`: renders all messages for a specific room for this `/:roomName/messages` route. This is a legacy feature from a previous lab for this course.
	
**controllers/register.js**
- This is the where we implement user registration and authentication.
- 	- `signupPage()`: renders the appropriate page to register a user.
	- `signup()`: grabs information from `<input>` fields on the `signup page`, using **Bcrypt** to salt and hash password before sending everything to the database. If a user with the same email exists, an error message will be rendered.
	- `loginPage()`:  renders the appropriate page to log a user into the session.
	- `login()`: grabs information from `<input>` fields on the `login page`. If the email matches, we will proceed to use **Bcyrpt** to match the hashed password inside the database. If the password matching fails, an error message will be rendered.
 	- `logout()`: destroys user session information and redirects the user to this `/register` route.
 	- `forgotPassword()`: 
 	- `changePassword()`:

**config/default.json**
- This is where the `MongoURI` property and Session's `Secret` properties are stored.

**models/Room.js**
- MongoDB schema for each room. Each room has the following properties:
	- `name`: the name for the chatroom, generated randomly.
	- `messages`: this is an array of message, each message has several properties
		- `username`: the author of the message
		- `date`: the date on which this message is stored in the database
		- `message`: the actual message
		- `userID`: the ObjectId that references the author of this message

**models/User.js**
- MongoDB schema for each registered user. Each user has the following properties:
	- `first`: first name of the user
	- `last`: last name of the user
	- `email`: email 
	- `password`: the salted and hashed password provided by **Bcyrpt**
	- `phone`: phone number
	- `birthday`: birthday
	- `friends`: the ObjectId that references other `User`. 
		- Note: This feature has been put on hold due to the time constraint.

**public/images**
- Contains icons for deleting /editing a message

**public/css/style.css**
- The CSS styling for the entire application

**util/roomIdGenerator.js**
- The ID generator provided by this course.

**views/layouts/layout.hbs**
- This is the layout that is used in every page.

**views/allMessages.hbs**
- This hbs file is rendered when a user goes to this `/:roomName/messages` route, which displays all messages for the current room

**views/forgotPassword.hbs**
- This hbs file is rendered when a user goes to this `/forgotPassword` route, which displays the necessary input fields to reset a user's password.

**views/home.hbs**
- This hbs file is rendered when a user goes to this `/` route, which is the homepage of *ScottyChat*

**views/login.hbs**
- This hbs file is rendered when a user goes to this `/login` route, which displays the necessary input fields to log a user in.

**views/register.hbs**
- This hbs file is rendered when a user goes to this `/register` route, which displays the necessary input fields to sign a user up.

**views/room.hbs**
- This hbs file is rendered when a user goes to this `/:roomName` route, which displays an active chatroom and the corresponding messages.
	- This file contains javascript `<script>` tag that utilizes Socket.IO functionalities which provides real-time data updates both on the server and the client side through event emission and event listening.

