var lodash = require("lodash");
//var userProfileDb = require('../utility/UserConnectionDB');
var userM =  require('../models/user');
var hashing = require("./saltHashing");

var addUser = async function(uName,password,fName, lName, email) {
  try {
      if(!await doesUserExists(uName)){
        let randomString = String(Math.random() * Math.floor(10000)).split(".");
        let randomId = randomString[0] + "user" + randomString[1].substr(0, 4);
        let hashedPassword = hashing.encryptPassword(password);
        var newUser = new userM({
          userId: randomId,
          userName:uName,
          password:hashedPassword,
          userFirstName: fName,
          userLastName: lName,
          userEmail: email
        });
        let result = await newUser.save();

        if (result == newUser) {
          console.log("User Added");
          return {response : true, error : "User created successfully",user:result};
        } else {
          console.log("User Adding failed");
          return {response : false, error : "Error while creating user"};
        }
      }
      else{
        console.log("User exists");
        return {response : false, error : "User already exists"};
      }
    } catch (error) {
      console.log("Error while saving user : " + error);
      return {response : false, error : "Error while creating user"};
    }

};

async function doesUserExists(username){
  var existingUser = await userM.find({username:username});
  return existingUser.length > 0 ;
}

var getAllUsers = async function getAllUsers() {
  try {
  // console.log("aaya");
    let result = await userM.find();
//   console.log(result[0]);
    return result;
  } catch (error) {
    console.log("Error  getting  users : " + error);
    return [];
  }
};

var getUser = async function getUser(userId){
  try {
    let result = await userM.find({userId:userId});
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error while getting user : " + error);
    return [];
  }
};

var getUserFromDB = async function getUserFromDB(username) {
  try {
    let result = await userM.find({
      userName: username,
    //  password: credentials.password
    });
    console.log();
    if(result && result.length > 0){
      return result[0];
    }
    else{
      return null;
    }
  } catch (error) {
    console.log("Error while getting single user : " + error);
    return null;
  }
};

var validateUser = async function validateUser(userHashedPassword, password) {
  try {
    let isValid = hashing.validatePassword(userHashedPassword,password);
    if (isValid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while validating user : " + error);
    return false;
  }
  //   let result = await userM.find({ username: username, password: password });
  //   return result !== null;
  // } catch (error) {
  //   console.log("Error while getting single user : " + error);
  //   return false;
  // }
};


module.exports = {
  getAllUsers: getAllUsers,
  getUser:getUser,
  getUserFromDB:getUserFromDB,
  validateUser: validateUser,
  addUser:addUser
};
