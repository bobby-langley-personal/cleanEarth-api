const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {getEvents, postEvent, deleteEvent, updateEvent, getUserEvents} = require("./src/events/index");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/events", getEvents);
app.post("/events", postEvent);
app.patch('/events/:eventId', updateEvent)
app.delete('/events/:eventId', deleteEvent)

app.get('/events/:userId', getUserEvents)


exports.app = functions.https.onRequest(app);
