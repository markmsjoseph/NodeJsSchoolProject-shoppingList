// as always, require the module
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
URLSlugs = require('mongoose-url-slugs');

var UserSchema = new mongoose.Schema({ });
UserSchema.plugin(passportLocalMongoose);

var User = new mongoose.Schema({
  images:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

var Image = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  url: {type:String, required: true},
});
//an item will have these properties
var Item = new mongoose.Schema({
	name: String,
  quantity: Number,
	checked: {type: Boolean, default:false}
});
// define the data in our collection
var List = new mongoose.Schema({
  name: String,
  createdBy:String,
  items: [Item]
});



// "register" it so that mongoose knows about it
mongoose.model('User', UserSchema);
User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('name createdBy'));
mongoose.model('List', List);
mongoose.model('Item', Item);
mongoose.connect('mongodb://localhost/grocerydb');
