<<<<<<< HEAD
//By Gary Chen

=======
>>>>>>> 2477ff60ada49ac9378a1dffe6f77db4f601178e
//Get MongoDB Schema
const Room = require('../models/Room')

//GET request for reaching '/' home page
async function getHome(request, response){

  //Get all the rooms from the database
  const rooms = await Room.find({}).lean()

  //Render the home page and passing all the rooms
  response.render('home',{
    rooms: rooms,
  })
}

module.exports = {
    getHome,
}