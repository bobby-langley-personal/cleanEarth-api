var admin = require("firebase-admin");
var serviceAccount = require("../../credentials.json");

let db;

function dbAuth() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
      db = admin.firestore();
    }
}
exports.getEvents = (req, res) => {
  // if(!req.params.userId){
  //     res.status(400).send('Invalid Request')
  // }
  dbAuth();
//   .where('userId', '==', req.params.userId)
  db.collection('events').get()
    .then(collection => {
      const eventsList = collection.docs.map(doc => {
        let event = doc.data()
        event.id = doc.id
        return event;
      });
      res.status(200).json(eventsList);
    })
    .catch((err) => res.status(500).send("GET EVENTS FAILED: " + err));
};



exports.postEvent = (req, res) => {
  // if (!req.body || !req.body.item || !req.body.userId || !req.params.userId) {
  //   res.status(400).send("Invalid request");
  // }
  dbAuth();
  let newEvent = req.body
  let now = admin.firestore.FieldValue.serverTimestamp()
  newEvent.updated = now 
  newEvent.created = now

  db.collection("events")
    .add(newEvent)
    .then(() => {
      this.getEvents(req, res);
    })
    .catch((err) => res.status(500).send("POST FAILED" + err));
    
};

exports.updateEvent = (req, res) => {
  if (!req.body || !req.params.eventId ) {
    res.status(400).send("Invalid request");
  }
  dbAuth();
  db.collection("events").doc(req.params.eventId).update(req.body)
      .then(() => this.getEvents(req,res))
      .catch(err => res.status(500).send('UPDATE FAILED: '+ err))
}

exports.deleteEvent = (req, res) => {
    if(!req.params.eventId) {
      res.status(400).send('Invalid request')
    }
    dbAuth()
    db.collection('events').doc(req.params.eventId).delete()
      .then(() => this.getEvents(req, res))
      .catch(err => res.status(500).send('DELETE FAILED: '+ err))
}

exports.getUserEvents = (req, res) => {
  if(!req.params.userId){
      res.status(400).send('Invalid Request')
  }
  dbAuth();
  db.collection("events").where('userId', '==', req.params.userId).get()
    .then((collection) => {
      const usersEvents = collection.docs.map((doc) => {
        let event = doc.data();
        event.id = doc.id;
        return event;
      });
      res.status(200).send(usersEvents);
    })
    .catch((err) => res.status(500).send("GET TASKS FAILED: " + err));
}