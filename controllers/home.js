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