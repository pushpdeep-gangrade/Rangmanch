var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var userDb = require("../utility/UserDB");
var userProfileDb = require('../utility/UserConnectionDB');
var urlencoded = bodyparser.urlencoded({ extended:true });
const { check, validationResult, body } = require("express-validator");

router.get("/login", async function(req, res) {
  if (req.session.loggedInUser == null) {
  res.render("login.ejs", {
    errorMessages: [],
    mainError: null,
    currentUser: req.session.loggedInUser
  });
}else{
  let uConList = await userProfileDb.getUserConnectionList(
    req.session.loggedInUser.userId
  );
  let userProfile = await userProfileDb.saveUserProfile(
      req.session.loggedInUser,
      uConList
    );
    if(userProfile){
      req.session.userProfile = userProfile;
    }
    res.render("savedConnections", {
      savedConnections: uConList,
      currentUser: req.session.loggedInUser
    });
  }

});

router.post("/signIn",urlencoded,[
    check("userName").not().isEmpty().withMessage("Username cannot be blank"),
    check("password").not().isEmpty().withMessage("Password cannot be blank").isLength(5).withMessage("Minimum 5 characters")
  ],
  async function(req, res, next) {
    const errors = validationResult(req).array();
    let passwordErrors = errors.find(val => {
      return val.param == "password";
    });
    let usernameErrors = errors.find(val => {
      return val.param == "userName";
    });

    let loginObject = [usernameErrors, passwordErrors];

    //navigate to saved connections page
    if (errors[0] == undefined && errors[1] == undefined) {
      //validate user
      let user = await userDb.getUserFromDB(req.body.userName);

      if(user !=null){
        let validUser = await userDb.validateUser(user.password,
          req.body.password
        );
        if(validUser){
          req.session.loggedInUser = user;
          var savedConnections = await userProfileDb.getUserConnectionList(user.userId);
          req.session.currentProfile = savedConnections;
              res.render("savedConnections.ejs", {
                  savedConnections: savedConnections,
                  currentUser: req.session.loggedInUser
                });
        }
        else {
          res.render("login.ejs", {errorMessages: [{ value:'',msg:'Invalid credentials',param: '',location: 'body'}],
            mainError: "Invalid credentials",
            currentUser: req.session.loggedInUser});
        }
      }
        else {
        res.render("login.ejs", {errorMessages: [{ value:'',msg:'User does not exists',param: '',location: 'body'}] ,
          mainError: "User does not exists",
          currentUser: req.session.loggedInUser});
      }
}else {
      res.render("login.ejs", {
        errorMessages: loginObject,
        mainError: null,
        currentUser: req.session.loggedInUser
      });
    }
    next();
  }
);

router.get("/signup", async function(req, res) {
  if (req.session.loggedInUser == null) {
    res.render("signup.ejs", {
      errorMessages: [],
      mainError: null,
      currentUser: req.session.loggedInUser
    });
}
else{
  req.session.isUserLoggedIn = false;
    req.session.loggedInUser = null;
    res.render("index.ejs", { currentUser: req.session.loggedInUser });
}
});

router.post("/signup",urlencoded,
 [check("userName").not().isEmpty().withMessage("Username field cannot be blank"),
  check("lastName").not().isEmpty().withMessage("Last name field cannot be blank"),
  check("email").not().isEmpty().withMessage("Email address field cannot be blank"),
  check("firstName").not().isEmpty().withMessage("Firstname field cannot be blank"),
  check("password").not().isEmpty().withMessage("Password cannot field be blank"),
  check("confirmpassword").not().isEmpty().withMessage("Confirm Password field cannot be blank")
  ],
  async function(req, res) {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      let firstnameErrors = errors.find(val => {return val.param == "firstName";});
      let lastnameErrors = errors.find(val => {return val.param == "lastName";});
      let emailErrors = errors.find(val => {return val.param == "email";});
      let usernameErrors = errors.find(val => {return val.param == "userName";});
      let passwordErrors = errors.find(val => {return val.param == "password";});
      let confpasswordErrors = errors.find(val => {return val.param == "confirmpassword";});
      if (passwordErrors == null && confpasswordErrors == null) {
        if (req.body.password !== req.body.confirmpassword) {
          confpasswordErrors = {
            msg: "Passwords do not match each other"
          };
        }
      }
      let errorObject = [firstnameErrors,lastnameErrors,emailErrors,
        usernameErrors,passwordErrors,confpasswordErrors];
      res.render("signup.ejs", {
        errorMessages: errorObject,
        mainError: null,
        currentUser: req.session.loggedInUser
      });
    } else {
      var addUserOperation = await userDb.addUser(
        req.body.userName,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.email
      );
      if (addUserOperation.res) {
        res.send("success");
      } else {
        res.render("login.ejs", {
          errorMessages: [],
          mainError: addUserOperation.error,
          currentUser: req.session.loggedInUser
        });
      }
    }
  }
);

//Save rsvp
router.get("/savedConnections/updateRSVP?",async function(req,res){
  if (req.session.loggedInUser != null) {
  let isSuccess = false;
  if (req.query) {
    isSuccess = await userProfileDb.saveUserConnection(
    req.query.status,
    req.query.conId,
    req.session.loggedInUser.userId
    );

  if (isSuccess) {
    var savedConnections = await userProfileDb.getUserConnectionList(req.session.loggedInUser.userId);
    savedConnections = await userProfileDb.getUserConnectionList(req.session.loggedInUser.userId);
    console.log(savedConnections);
    res.render("savedConnections.ejs", {
      savedConnections: savedConnections,
      currentUser: req.session.loggedInUser
    });
  } else {
    res.send("Something went wrong");
  }}
} else {  res.render("login.ejs", {
    errorMessages: [{ value:'',msg:'Please login to proceed',param: '',location: 'body'}],
    mainError: null,
    currentUser: req.session.loggedInUser
  });
}
});

router.get('/savedConnections',async function(req,res){
  var savedConnections = await userProfileDb.getUserConnectionList(req.session.loggedInUser.userId);
  res.render("savedConnections", {
      savedConnections: savedConnections,
      currentUser: req.session.loggedInUser
    });
});

router.get('/delete?',async function(req,res){
    let opResult;
    if (req.query) {
  opResult = await userProfileDb.removeUserConnection(
    req.query.conId,
    req.session.loggedInUser.userId);
  }
  if (opResult) {
  var savedConnections = await userProfileDb.getUserConnectionList(req.session.loggedInUser.userId);
  res.render("savedConnections.ejs", {
    savedConnections: savedConnections,
    currentUser: req.session.loggedInUser
  });
} else {
  res.send("Something went wrong. URL not proper");
}
});

module.exports = router;
