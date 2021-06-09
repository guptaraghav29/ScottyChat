// By Gary Chen

const roomGenerator = require('../util/roomIdGenerator.js') //Room ID generator
const Room = require('../models/Room')  //MongoDB Schema

//Setting socket on connection
io.on('connection', socket => {
    console.log("A user is connected.")

    //When socket receives "newMessage" event from the client, it will push message and 
    //username into the database for the current chatroom.
    socket.on("newMessage", data => {
        console.log("Received new mesage.")


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
})

//GET request to display existing chat room
function getRoom(request, response){

    //Use the chat room ID to fetch corresponding document from database
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

//
//POST request to store username
// function usernameSet(request, response){
//     //When a user typed a username/nickname, it will be saved into a cookie.
//     response.cookie('username', request.body.username)    

//     //Then I redirect them back to the room they were in.
//     response.redirect(`/${request.cookies.roomName}`)
// }

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
