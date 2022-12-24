var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
var $ = require('jquery');



// admin login
router.get('/', function (req, res) {


  let userAdmin = req.session.admin
  if (userAdmin) {
    productHelper.getAllMovies().then((movies) => {
      res.render('admin/view-movies', { admin: true, userAdmin, movies })

    })
    // res.render('admin/view-movies',{admin:true,userAdmin})

  }
  else {
    res.render('admin/admin-login', { admin: true })
  }

})

router.post('/admin-login', function (req, res, next) {


  productHelper.adminLogin(req.body).then((userData) => {
    let user = userData.status

    if (user) {
      req.session.loggedIn = true;
      req.session.admin = userData.user
      res.redirect('/admin')

    }
    else {
      res.redirect('/admin')
    }
  })
}
)

router.get('/logout', function (req, res) {
  req.session.loggedIn = false;
  req.session.admin = null;
  // req.session.destroy()
  res.redirect('/admin')

})


//adding movies

router.get('/add-movies', function (req, res) {
  if (req.session.admin) {
    let userAdmin = req.session.admin
    res.render('admin/add-movies', { admin: true, userAdmin });
  }
  else {
    res.redirect('/admin')
  }



})


router.post('/add-movies', function (req, res) {

  productHelper.addMovies(req.body)
  res.redirect('/admin/add-movies')


})


//user adding

router.get('/add-user', function (req, res) {
  if (req.session.admin) {

    let userAdmin = req.session.admin
    res.render('admin/add-user', { admin: true, userAdmin })
  }
  else {
    res.redirect('/admin')
  }


})

//user to database
router.post('/add-user', function (req, res) {

  productHelper.addUsers(req.body).then((user) => {
    let oldUser = user.status;

    if (oldUser) {
      res.render('admin/add-user', { admin: true, oldUser })
    }
    else {
      res.redirect('/admin/add-user')
    }
  })



})


//movies

router.get('/movies', function (req, res) {

  res.redirect('/admin')

})

//users

router.get('/users', function (req, res) {
  let userAdmin = req.session.admin
  if (userAdmin) {
    productHelper.getAllUsers().then((users) => {
      res.render('admin/view-users', { users, admin: true, userAdmin })
    })


  }
  else {
    res.redirect('/admin')
  }


})

//delete user

router.get('/delete-user/:id', function (req, res) {
  if (req.session.admin) {
    let userId = req.params.id
    productHelper.deleteUser(userId).then((response) => {
      res.redirect('/admin/users')
    })
  }
  else {
    res.redirect('/admin')
  }

})

//edit user
router.get('/edit-user/:id', async function (req, res) {
  if (req.session.admin) {
    let user = await productHelper.getUserDetails(req.params.id)

    res.render('admin/edit-user', { user, admin: true })
  }
  else {
    res.redirect('/admin')
  }

})


//update user

router.post('/edit-user', function (req, res) {

  if (req.session.admin) {
    productHelper.updateUser(req.body).then((response) => {
      res.redirect('/admin/users')

    })

  }
  else {
    res.redirect('/admin')
  }

})



module.exports = router;
