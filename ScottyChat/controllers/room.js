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
    socket.on("newMessage", data => {
        console.log("Received new mesage.")
        if( socket.message != null || data.message !== "" ){
            User.findById( data.sessionUserID ).then( user => {
                var first = user.first
                var last = user.last
                var userID = mongoose.Types.ObjectId(user._id)

                Room.findOneAndUpdate(
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

    socket.on("editMessage", data => {
        console.log("Received edit message.")
        User.findById( data.sessionUserID ).then( user => {
            var userID = user._id
            console.log(`message: ${data.message}`)

            if( userID.toString() !== data.userID ){
                io.emit("editRejected")
            } else {
                Room.findOneAndUpdate(
                    { name: data.roomName, 
                      messages: { $elemMatch: { userID: data.userID, message: data.message } } },
                    { $set: {
                         'messages.$.message': data.newMessage
                    }}
                ).then( data => {
                    console.log(`Edited message.`)
                    io.emit('editMessage')
                }).catch( err => console.log(err))
            }
        }).catch(err => console.log(err))
    })
})

//GET request to display existing chat room
function getRoom(request, response){
    console.log("Fetching room pls wait")
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
            response.render( "room",
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
