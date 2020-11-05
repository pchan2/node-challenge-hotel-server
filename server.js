// https://glitch.com/edit/#!/patrickchan-hotel-server?path=server.js%3A1%3A56
// https://github.com/pchan2/node-challenge-hotel-server

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// CREATE A BOOKING
app.post("/bookings", function (request, response) {
  const newBooking = request.body;

  if(newBooking.roomId === "" || newBooking.title === "" || newBooking.firstName === "" || newBooking.surname === "" || newBooking.email === "" || newBooking.checkInDate === "" || newBooking.checkOutDate === "") {
    response.sendStatus(404).json("Please fill out all fields");
  }
  bookings.push(newBooking);
  newBooking.id = bookings.length;
  response.status(200).json(newBooking);
});

// RETRIEVE ALL BOOKINGS
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// RETRIEVE ONE BOOKING BY ID
/* ERROR
app.get("/bookings/:id", function (request, response) {
  const {id} = request.params;

  const bookingFiltered =
    bookings.filter(booking => {
      if(booking.id == id) {
        console.log(bookingFiltered);
        response.json(bookingFiltered);
      } else {
        response.status(404).json("Booking ID " + id + " not found");
      }
    });  
});
*/

app.get("/bookings/:id", function (request, response) {
  const {id} = request.params;
  
  const bookingObj = bookings.find(booking => booking.id == id);
  
  if(bookingObj) {
    response.json(bookingObj);
  } else {
    response.status(404).json("Booking ID " + id + " not found");
  }  
});

// DELETE A BOOKING BY ID
app.delete("/bookings/:id", function (request, response) {
  
  const deleteId = request.params.id;
  if(isNaN(deleteId)) {
    return response.send(400, {
      message: "Please include a numeric ID inside the route"
    })
  }

  let index = bookings.findIndex(booking => booking.id == deleteId);
  if(index < 0) {
    return response.send(404, {
      message: "ID not found, please try again"
    })
  }

  bookings.splice(index, 1);
  return response.json(bookings);

  // !bookings.id ? response.sendStatus(404) : (bookings = bookings.filter(item => item.id != id), response.send(bookings));
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
