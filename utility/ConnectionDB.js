var conModel =  require('./../models/connection');
var lodash = require('lodash');

var addConnection = async function(conId,cName,cTopic,cDetails,cLocation,cDate,cTime) {
  try {
    var res = new conModel({
      conId: conId,
      conName: cName,
      conTopic: cTopic,
      conDetails: cDetails,
      conLocation: cLocation,
      conDate: cDate,
      conTime: cTime
    });
    let opRes = await res.save();
    if(opRes == res){
      console.log("Connection added");
    }
  } catch (error) {
    console.log("Error while saving connection : " + error);
  }
};

//Function which gets list of connections and groups them by its topic. Grouping done so as to ease the mapping items to view
var getConnections = async function getConnections() {
  try {
  //  console.log(conModel);
    let result = await conModel.find();
  //  console.log("result "+result);
    return lodash.groupBy(result, value => {
      return value.conTopic;
    });
  } catch (error) {
    console.log("Error while getting all connections : " + error);
    return [];
  }
};

var getConnection = async function getConnection(connectionID) {
  try {
    let result = await conModel.find({ conId: connectionID });
    if (result.length > 0) {
  //    console.log("result is " +result);
      return result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error while getting single connection : " + error);
    return null;
  }
};

var deleteConnection = async function(connectionId) {
  try {
    const res = await conModel.deleteOne({
      conId: connectionId
    });
    return true;
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
  getConnection: getConnection,
  addConnection:addConnection,
  getConnections: getConnections,
  deleteConnection: deleteConnection
};
