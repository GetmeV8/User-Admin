const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelper = require('../helpers/product-helpers');
const userHelper = require('../helpers/user-helpers');
var $  = require( 'jquery' );

/* user home */
router.get('/', function (req, res, next) {
 
  let user = req.session.user
 
    productHelper.getAllMovies().then((movies) => {
      res.render('user/user-products', { movies, user });
  
    })

  
 
 

});

// user login

router.get('/login', function (req, res, next) {
  if(req.session.loggedUserIn){
    res.redirect('/')
  }else{
    res.render('user/userlogin')

  }
  
})

router.post('/login', function (req, res, next) {
  if(req.session.loggedUserIn){
    res.redirect('/')
  }else{
    userHelper.doLogin(req.body).then((response) => {
      let user = response.status;
  
      if (user) {
        req.session.loggedUserIn = true
        req.session.user = response.user
        res.redirect('/')
      }
      else {
        let noUser = true;
        
        res.render('user/userlogin', { noUser })
      }
    })

  }
  

})

//user logout

router.get('/logout', (req, res, next) => {
  req.session.loggedUserIn=false;
  req.session.user = null;
  // req.session.destroy();
  res.redirect('/');
})

//user signup

router.get('/signup', function (req, res, next) {
  if(req.session.loggedUserIn){
    res.redirect('/')
  }else{
    res.render('user/usersignup')

  }
  

})

router.post('/signup', function (req, res, next) {
  if(req.session.loggedUserIn){
    res.redirect('/')
  }else{
    userHelper.doSignup(req.body).then((users) => {
      let regUser = users.status
      let user = users.userData
  
      if (regUser) {
        res.render('user/usersignup', { regUser })
  
      }
      else {
        res.render('user/userlogin', { user })
  
  
      }
  
  
    })

  }
  


})




module.exports = router;
