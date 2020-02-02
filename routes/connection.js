var express = require('express');
var routerCon = express.Router();
var bodyparser = require('body-parser');
var connectionDB = require('./../utility/ConnectionDB');
var userDb = require("../utility/UserDB");
var userProfileDb = require('../utility/UserConnectionDB');
var urlencoded = bodyparser.urlencoded({ extended:true });
const { check, validationResult, body } = require("express-validator");

routerCon.get("/connections", async function(req, res) {
  connectionDB.getConnections().then(connectionData => {
  //  console.log(connectionData);
    if (Object.keys(connectionData).length > 0) {
      res.render("connections.ejs",  {
        connectionTopics: connectionData,
        currentUser: req.session.loggedInUser
      });
    } else {
      res.render("connections.ejs",{
       connectionTopics:[],
        currentUser: req.session.loggedInUser
      });
    }
  });
});

routerCon.get("/connection?", async function(req, res) {
  if (req.query && req.query.conId) {
    let connectionDetails = await connectionDB.getConnection(
      req.query.conId
    );
    if (connectionDetails == null) {
      res.send(
        "Connection Id is invalid. Please check the URL or go back to previous page and select the connection again"
      );
    }
    else{
      res.render("connection.ejs", {
        currentUserId:req.session.loggedInUser == null ? null: req.session.loggedInUser.userId,
        singleConnection: connectionDetails,
        currentUser: req.session.loggedInUser
      });
    }
  } else {
    res.send("return back and try again");
  }
});

routerCon.get("/newConnection",async function(req, res) {
  if (req.session.loggedInUser == null) {
    res.render("login.ejs", {
      errorMessages: [],
      mainError: null,
      currentUser: req.session.loggedInUser
    });
  }
  else {
    if (req.query.conId) {
    let connectionDetails = await connectionDB.getConnection(
      req.query.conId
    );
  //  console.log(connectionDetails);
    res.render("newConnection.ejs", {
      errorMessages: [],
      inputValues: [connectionDetails.conId,connectionDetails.conTopic,connectionDetails.conName,
        connectionDetails.conDetails,connectionDetails.conLocation,
        connectionDetails.conDate,
        connectionDetails.conTime],
      currentUser: req.session.loggedInUser
    });
    }else {
        res.render("newConnection.ejs", {
        errorMessages: [],
        inputValues: [],
        currentUser: req.session.loggedInUser
      });
    }
   }
 });

routerCon.post("/newConnection", urlencoded,
[ check("conId").not().isEmpty().withMessage("Connection ID can't be empty"),
  check("name").not().isEmpty().withMessage("Topic can't be empty"),
  check("topic").not().isEmpty().withMessage("Categorycan't be empty"),
  check("details").not().isEmpty().withMessage("Topic can't be empty"),
  check("where").not().isEmpty().withMessage("Location can't be empty"),
  check("date").not().isEmpty().withMessage("Date can't be empty"),
  check("time").not().isEmpty().withMessage("Time can't be empty")]
  , async function(req,res,next){
  if (req.session.loggedInUser != null) {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      let conIDErrors = errors.find(val => {return val.param == "conId";});
      let nameErrors = errors.find(val => {return val.param == "topic";});
      let topicErrors = errors.find(val => {return val.param == "name";});
      let detailsErrors = errors.find(val => {return val.param == "details";});
      let locationErrors = errors.find(val => {return val.param == "where";});
      let dateErrors = errors.find(val => {return val.param == "date";});
      let timeErrors = errors.find(val => {return val.param == "time";});
      let errorObject = [conIDErrors,nameErrors,topicErrors,detailsErrors,
        locationErrors,dateErrors,timeErrors];
        res.render("newConnection.ejs", {
        errorMessages: errorObject,
          inputValues: [],
        currentUser: req.session.loggedInUser
      });}
      else{
      //  console.log(req.body);
    await userProfileDb.saveConnection(req.body.conId,req.body.name,req.body.topic,
      req.body.details,req.body.where,req.body.date,req.body.time,req.session.loggedInUser.userId);
    let connectionData = await connectionDB.getConnections();
    if (Object.keys(connectionData).length > 0) {
      res.render("connections.ejs", {
        connectionTopics: connectionData,
        currentUser: req.session.loggedInUser
      });
    }
   else {
    res.render("login.ejs", {
      errorMessages: [],
      currentUser: req.session.loggedInUser});
  }}
  next();}
});

routerCon.get("/deleteConnection?", async function(req, res) {
  if (req.query && req.query.conId) {
    let deleteOperation = await connectionDB.deleteConnection(
      req.query.conId
    );
    if (deleteOperation) {
      let allDeleteOperation = await userProfileDb.removeAllUserConnectionBasedOnConId(
        req.query.conId
      );
      if (allDeleteOperation) {
        connectionDB.getConnections().then(connectionData => {
          if (Object.keys(connectionData).length > 0) {
            res.render("connections.ejs", {
              connectionTopics: connectionData,
              currentUser: req.session.loggedInUser
            });
          } else {
            res.send("No connections");
          }
        });
      } else {
        res.send("Delete operation failed");
      }
    } else {
      res.send("Delete operation failed");
    }
  } else {
    res.send("Please return back to previous page and try again");
  }
});

module.exports = routerCon;
