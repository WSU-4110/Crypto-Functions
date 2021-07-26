const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { ref } = require("firebase-functions/lib/providers/database");

const app = express();
app.use(cors());
admin.initializeApp();
const db = admin.firestore();

exports.app = functions.https.onRequest(app);
const usersDocRef = db.collection("users");

app.post("/user", async (req, res) => {
  const { userid, useremail, userphonenumber } = req.body
  const results = await usersDocRef.add({
    userid,
    useremail,
    userphonenumber,
    currency: {}
  });

  res.send(results.id);
});

app.get("/user/:id", async (req, res) => {

  console.log(req);

  try {
    const { id } = req.params
    const querySnapshot = await usersDocRef.where("userid", "==", id).get();
    let currentUser;

    querySnapshot.forEach(user => {
      currentUser = {
        id: user.id,
        data: user.data()
      }
    })

    res.send(currentUser);
  }

  catch (error) {
    res.send(error);
  }

});



app.post("/alert", async (req, res) => {
  const { id, BTC, ETH, DOGE } = req.body
  const results = await usersDocRef.doc(id).update({
    currency: {
      BTC,
      ETH,
      DOGE
    }
  });

  res.send(results);
});

app.get("/health", (req, res) => {
  res.send("Endpoint is Healthy!");
});

app.post("/userpref", (req, res) => {
  res.send("Message Received!");
});
