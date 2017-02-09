var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teddy-bear');
mongoose.Promise = global.Promise;
var textSearch = require('mongoose-text-search');

var Product = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	nameUpperCase: {type: String, required: true, index: true},
	category: {type: Object, required: true},
	subcategory: {type: Object},
	address: {type: String, required: true, unique: true},
	price: {type: Number, default: 999999},
	discountPrice: {type: Number, default: 999999},
	quantity: {type: Number, default: 0},
	description: {type: String},
	code: {type: String},
	isHit: {type: Boolean, default: false},
	isSpecialProp: {type: Boolean, default: false},
	discount: {type: Number, default: 0},
	image: {type: String, default: 'images/products/no-image.jpg'},
	image_thumb: {type: String, default: 'images/products/no-image_thumb.jpg'}
});

Product.plugin(textSearch);
Product.index({nameUpperCase: 'text'});

var Category = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	subcategory: {type: Array},
	currentSubcategoryId: {type: Number, default: 0}
});

var Order = new mongoose.Schema({
	product: {type: Array, required: true},
	totalPrice: {type: Number, required: true},
	name: {type: String, required: true},
	email: {type: String},
	date: {type: Date},
	isItNew: {type: Boolean, default: true}
});

var SpecialProp = new mongoose.Schema({
	durancy: {type: Date},
	target: {type: Object},
	discount: {type: Number, default: 0},
	describe: {type: String}
});

var Admin = new mongoose.Schema({
	login: {type: String, required: true},
	loginUpperCase: {type: String, unique: true, required: true},
	passwd: {type: String, required: true},
	session: {type: String, default: '0'},
	newOrders: {type: Number, default: 0},
	activeOrders: {type: Number, default: 0}
});

module.exports.Product = mongoose.model('productdata', Product);
module.exports.Category = mongoose.model('categorydata', Category);
module.exports.Order = mongoose.model('orderdata', Order);
module.exports.Admin = mongoose.model('admindata', Admin);
module.exports.SpecialProp = mongoose.model('specialprop', SpecialProp);