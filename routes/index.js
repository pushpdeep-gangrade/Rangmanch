var express = require('express');
var routerIndex = express.Router();

routerIndex.get('/about',function(req,res){
  res.render('about',{currentUser: req.session.loggedInUser});
});

routerIndex.get('/contact',function(req,res){
  res.render('contact',{currentUser: req.session.loggedInUser});
});

routerIndex.get('/*',function(req,res){
  res.render('index',{currentUser: req.session.loggedInUser});
});

module.exports = routerIndex;
