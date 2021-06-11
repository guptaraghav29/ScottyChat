// By Gary Chen

const roomGenerator = require('../util/roomIdGenerator.js') //Room ID generator
const Room = require('../models/Room')  //MongoDB Schema
<<<<<<< HEAD

//Setting socket on connection
io.on('connection', socket => {
    console.log("A user is connected.")

=======
const User = require('../models/User')
const mongoose = require('mongoose')

//Setting socket on connection
io.on('connection', socket => {
    console.log(`A user is connected.`)
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
    //When socket receives "newMessage" event from the client, it will push message and 
    //username into the database for the current chatroom.
    socket.on("newMessage", data => {
        console.log("Received new mesage.")
<<<<<<< HEAD

        if( socket.message != null || data.message !== "" ){
            console.log(`Pushing new message into DB: ${data.roomName}, ${data.username}`)
            Room.updateOne(
                { name: data.roomName },
                { $push: 
                    { messages: [{
                        userName : data.username,
                        message: data.message
                }]}}
            ).then( data => {
                //When it finished updating the database, it will emit "newMessage" to the client
                //and the client will refresh the page to show new messages.
                io.emit('newMessage')
            }
            ).catch( err => console.err(err))
        }
    })
=======
        if( socket.message != null || data.message !== "" ){
            User.findById( data.sessionUserID ).then( user => {
                var first = user.first
                var last = user.last
                var userID = mongoose.Types.ObjectId(user._id)

                Room.updateOne(
                    { name: data.roomName }, 
                    { $push: 
                        { messages: [{
                            username : {
                                first: first,
                                last: last, 
                            },
                            message: data.message,
                            userID: userID
                    }]}}
                ).then( data => {
                    //When it finished updating the database, it will emit "newMessage" to the client
                    //and the client will refresh the page to show new messages.
                    console.log("Finished pushing new message.")
                    io.emit('newMessage')
                }).catch( err => console.log(err))
            }).catch( err => console.log(err) )
        }
    })

    socket.on("deleteMessage", data => {
        console.log("Received delete message.")
        User.findById( data.sessionUserID ).then( user => {
            var userID = user._id
            console.log(`message: ${data.message}`)

            if( userID.toString() !== data.userID ){
                io.emit("deleteRejected")
            } else {
                Room.findOneAndUpdate(
                    { name: data.roomName },
                    { $pull: 
                        { messages: {
                            userID : userID,
                            message: data.message }
                        }
                    }
                ).then( data => {
                    console.log(`Deleted message.`)
                    io.emit('deleteMessage')
                }).catch( err => console.log(err))
            }
        }).catch(err => console.log(err))
    })
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
})

//GET request to display existing chat room
function getRoom(request, response){
<<<<<<< HEAD

=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
    //Use the chat room ID to fetch corresponding document from database
    Room.findOne({ name: request.params.roomName })
        .lean()
        .then( room => {            
            //Storing the current chat room ID inside a cookie
            response.cookie('roomName', request.params.roomName)
<<<<<<< HEAD
            
            //If the user has not set a username/nickname, then they cannot chat.
            var nameSet = false
            if( request.cookies.username != null ){
                nameSet = true
            }
=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e

            //Changing the date object into a more readable format.
            var newRoom = room.messages.map(m => {
                return {
                    ...m,
                    date: m.date.toLocaleTimeString(),
                }
            })

            //Render the corresponding room.
<<<<<<< HEAD
            response.render(
                "room",
                {
                    name: request.params.roomName,
                    username: "",
                    username_set: nameSet,
=======
            response.render( "room",
                {
                    name: request.params.roomName,
                    username: "",
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
                    messages: newRoom
                }
            )
        })
        .catch( err => {
            response.send(err)
        })
}

//POST request to create a new chat room
function createRoom(request, response){

    //Using the MongoDB Schema that I required
    const newRoom = new Room({
      name: roomGenerator.roomIdGenerator()
    })

    //Pushing the new room into the database and then redirecting to the correct room.
    newRoom
      .save()
      .then( _ => response.redirect(`/${newRoom.name}`) )
      .catch( err => console.err(err) )
}

<<<<<<< HEAD
//POST request to store username
function usernameSet(request, response){
    //When a user typed a username/nickname, it will be saved into a cookie.
    response.cookie('username', request.body.username)    

    //Then I redirect them back to the room they were in.
    response.redirect(`/${request.cookies.roomName}`)
}

=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
//Get request to show all the messages
function showAllMessage(request, response){
    Room.findOne({ name: request.params.roomName })
    .lean()
    .then( room => {            
        //Storing the current chat room ID inside a cookie
        response.cookie('roomName', request.params.roomName)
        
<<<<<<< HEAD
        //If the user has not set a username/nickname, then they cannot chat.
        var nameSet = false
        if( request.cookies.username != null ){
            nameSet = true
        }
=======
        // //If the user has not set a username/nickname, then they cannot chat.
        // var nameSet = false
        // if( request.cookies.username != null ){
        //     nameSet = true
        // }
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e

        //Changing the date object into a more readable format.
        var newRoom = room.messages.map(m => {
            return {
                ...m,
                date: m.date.toLocaleTimeString(),
            }
        })

        //Render the corresponding room.
        response.render(
            "allMessage",
            {
                name: request.params.roomName,
                username: "",
<<<<<<< HEAD
                username_set: nameSet,
=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
                messages: newRoom
            }
        )
    })
    .catch( err => {
        response.send(err)
    })
}

module.exports = {
    getRoom,
    createRoom,
<<<<<<< HEAD
    usernameSet,
=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
    showAllMessage
}
