var mongoose = require('mongoose');
var List = mongoose.model('List');
var Item = mongoose.model('Item');
var express = require('express');
var router = express.Router();


var passport = require('passport'),
    User = mongoose.model('User');
//redirect to the all list page
router.get('/', function(req, res){
	res.render('home',{register:'/register', login:'/login'});
});

router.get('/login', function(req, res) {
  	res.render('login',{register:'/register'});
});


router.get('/register', function(req, res) {
  res.render('register',{backToLogin: '/login'});
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}),
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });
});

router.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/list');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

//list create page with a link back to the all list page
router.get('/item/check', function(req, res){
 res.redirect( 301, '/name-createdBy');
});

//list create page with a link back to the all list page
router.get('/item/create', function(req, res){
 res.render( 'create', {allListUrl:'/list'});
});

//all list page which displays all the list and a link to the create list page
router.get('/list', function(req, res) {
   List.find({},function(err, list, count) {
     console.log(list);
     res.render( 'index', { list: list, createNewListUrl:'/list/create',
		  																		listPage:'/list/:slug', slug: req.params.slug});
   });
});

//this router will display the grocery list items
router.get('/list/:slug', function(req, res){
	List.findOne({slug: req.params.slug },function(err, list, count) {
		console.log("\nthe list isssssssssssssssssssssssssss", list);
		// res.render('name-createdBy', { slug: req.params.slug, list:list});
	res.render('name-createdBy', list);
	});
});


router.post('/list/create', function(req, res) {
	//create a new list instance
	 var list1 = new List({
		 name: req.body.nameOfItem,
		 createdBy: req.body.createdBy
		});
	list1.save(function(err, m, count) {
		 	res.redirect(303, '/list');
	 });
});

router.post('/item/create', function(req, res) {
	//create a new list instance
	 var item1 = new Item({
		 name: req.body.itemToAdd,
		quantity: req.body.quantityToAdd,
		 checked: false
		});
		//find the list to add this item to.
		List.findOne({slug: req.body.slug}, function(err, list, count) {
			var items = list.items;
			items.push(item1);
			list.markModified('items');
			list.save(function(err, modifiedList, count) {
				res.render('name-createdBy', list);
			});
		});
});

router.post('/item/check', function(req, res) {

		List.findOne({slug: req.body.slug}, function(err, list, count) {
			for (var i = 0; i < list.items.length; i++) {
					list.items[i].checked = true;
			}
			list.markModified('items');
			list.save(function(err, list, count) {
				res.render('name-createdBy', list);
			});
		});
});



module.exports = router;
