// By Gary Chen

const roomGenerator = require('../util/roomIdGenerator.js') //Room ID generator
const Room = require('../models/Room')  //MongoDB Schema
const User = require('../models/User')
const mongoose = require('mongoose')

//Setting socket on connection
io.on('connection', socket => {
    console.log(`A user is connected.`)
    //When socket receives "newMessage" event from the client, it will push message and 
    //username into the database for the current chatroom.
    socket.on("newMessage", async data => {
        console.log("Received new mesage.")
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
            var first = user.first
            var last = user.last
            var userID = user._id.toString()

            if( userID !== data.sessionUserID ){
                io.emit("deleteRejected")
            } else {
                Room.updateOne(
                    { name: data.roomName },
                    { $pull: 
                        { messages: [{
                            userID : data.sessionUserID,
                            date: data.date
                        }]}
                    }
                ).then( _ => io.emit('deleteMessage')
                ).catch( err => console.log(err))
            }
        })
    })
})

//GET request to display existing chat room
function getRoom(request, response){

    //Use the chat room ID to fetch corresponding document from database
    Room.findOne({ name: request.params.roomName })
        .lean()
        .then( room => {            
            //Storing the current chat room ID inside a cookie
            response.cookie('roomName', request.params.roomName)

            //Changing the date object into a more readable format.
            var newRoom = room.messages.map(m => {
                return {
                    ...m,
                    date: m.date.toLocaleTimeString(),
                }
            })

            //Render the corresponding room.
            response.render(
                "room",
                {
                    name: request.params.roomName,
                    username: "",
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

//Get request to show all the messages
function showAllMessage(request, response){
    Room.findOne({ name: request.params.roomName })
    .lean()
    .then( room => {            
        //Storing the current chat room ID inside a cookie
        response.cookie('roomName', request.params.roomName)
        
        // //If the user has not set a username/nickname, then they cannot chat.
        // var nameSet = false
        // if( request.cookies.username != null ){
        //     nameSet = true
        // }

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
    showAllMessage
}
