var lodash = require("lodash");    //for collection related operations
var conModel =  require('./../models/connection');
//var userConnectionModel = require('../models/UserConnection').userConnection;
var userConnectionModel = require('../models/userConnection');
var connection = require('../models/connection');
var UserProfile = require('../models/userProfile');
var connectionDb = require("../utility/ConnectionDB");

var addConnection = async function(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy) {
  try {
    var res = new conModel({conId: conId,conName: cName,conTopic: cTopic,conDetails: cDetails,
      conLocation: cLocation,conDate: cDate,conTime: cTime,createdBy:createdBy
    });
    let opRes = await res.save();
    if(opRes == res){
      console.log("Added");
    }
  } catch (error) {
    console.log("Error while saving connection : " + error);
  }
};

var getUserProfile = async function(userId){
  try {
    let result = await UserProfile.find({userId:userId});
  //  console.log(result);
    return result;
  } catch (error) {
    console.log("Error getting all user connections : " + error);
    return null;
  }
}

var saveUserProfile = async function(user,userConnectionList){
  try {
    var newUserProfile = new UserProfile({userObject: user, userConnections: userConnectionList});
    let result = await newUserProfile.save();
    if(result == newUserProfile){
      console.log("User profile Added");
    }
    else{
      console.log("User profile Adding failed");
    }
  } catch (error) {
//    console.log("Error while saving User profile : " + error);
  }
}

var getUserConnectionList = async function(userId) {


  try {
  let result = await userConnectionModel.find({ userId: userId });
  for (let i = 0; i < result.length; i++) {
    let connection = await connectionDb.getConnection(result[i].conId);
    result[i].connection= connection;
  }
  return result;
} catch (error) {
  console.log("Error while getting all user connections : " + error);
  return [];
}
};

var removeUserConnection = async function(connectionId,userId) {
  //  var connectionDetails = await connectionDb.getConnection(connectionId);
try{
    const res = await userConnectionModel.deleteOne({
      userId: userId,
      conId: connectionId
    });
    return res.ok > 0 && res.deletedCount > 0;
} catch (error) {
  console.log("Error while removing user connection : " + error);
  return false;
}
  //  console.log(res);
    //console.log("Removed");
  }

var addUserConnection = async function(rsvp,connectionId,userId){
  try {
    var connectionDetails = await connectionDb.getConnection(connectionId);
    var newConnection = new userConnectionModel({userId: userId, conId: connectionId, userRSVP: rsvp});
    let result = await newConnection.save();
    if(result == newConnection){
      console.log("Connection Added");
    }
    else{
      console.log("Connection Adding failed");
    }

  } catch (error) {
console.log("Error while saving user : " + error);
}
}

var updateUserConnection = async function(item,rsvpStatus){
    const result = await userConnectionModel.updateOne(item,{userRSVP:rsvpStatus});
}

var saveUserConnection = async function(rsvp, connectionId, userId) {
//  var newConnection = await connectionDb.getConnection(connectionId);

  let element = await userConnectionModel.findOne({userId:userId,conId:connectionId});
  if(element){
 //update connection
 updateUserConnection(element,rsvp);
  }
  else{
 //add connection
 addUserConnection(rsvp,connectionId,userId);
  }
  return true;
};

var emptyProfile = async function(userId){
  const res = await userConnectionModel.deleteMany({ userId: userId });
}

async function updateConnection(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy) {
  let updObj = {
    conId: conId,
    conName: cName,
    conTopic: cTopic,
    conDetails: cDetails,
    conLocation: cLocation,
    conDate: cDate,
    conTime:cTime,
    createdBy: createdBy
  };
  let operation = await connection.findOneAndUpdate({ conId: conId },
    updObj,{useFindAndModify:false}
  );

  console.log(operation);
  if(operation){
    if (operation == updObj) {
      return true;
    } else {
      return false;
    }
  }
  else {
    addConnection(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy);
  }
  // if (operation == updObj) {
  //   return true;
  // } else {
  //   return false;
  // }
}
var saveConnection = async function(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy) {
  if (conId) {
    //update connection
    updateConnection(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy);
  }
  // else {
  //   //add connection
  //   await addConnection(conId,cName, cTopic,cDetails,cLocation,cDate,cTime,createdBy);
  // }
};

var removeAllUserConnectionBasedOnConId = async function(connectionId) {
  try {
    const res = await userConnectionModel.deleteMany({
      conId: connectionId
    });
    console.log(res);
    return res.ok > 0 ;
  } catch (error) {
    console.log("Error while removing user connection : " + error);
    return false;
  }
  // `1` if MongoDB deleted a doc, `0` if no docs matched the filter `{ name: ... }`
  // The returned promise resolves to an object that contains 3 properties:
  // ok: 1 if no errors occurred
  // deletedCount: the number of documents deleted
  // n: the number of documents deleted. Equal to deletedCount.
};

module.exports = {
  getUserProfile: getUserProfile,
  saveUserProfile:saveUserProfile,
  getUserConnectionList: getUserConnectionList,
  removeUserConnection: removeUserConnection,
  saveUserConnection: saveUserConnection,
  removeAllUserConnectionBasedOnConId: removeAllUserConnectionBasedOnConId,
  emptyProfile:emptyProfile,
  saveConnection:saveConnection,
};
