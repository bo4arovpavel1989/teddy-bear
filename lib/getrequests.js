var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;
var async= require('async');
var textSearch = require('mongoose-text-search');

module.exports.getFacePage = function(req, res){
	var data = {
		product: [],
		category: []
	};
	async.parallel([
		function(callback) { 
			Category.find({}, function(err, rep){
				if(rep) {
					console.log(rep);
					data.category = rep;
					callback();
				}
			});
		},
		function(callback) {
			Product.find({isHit: true}, function(err, rep){
				if(rep) {
					data.product = rep;
					callback();
				}
			})
		}
		], function(err) { 
			res.render('index', data);
	});
};

module.exports.searchProduct = function(req, res){
	var data={
		product: []
	};
	var productToFind = req.query.product;
	var reg = new RegExp(productToFind, "i")
	console.log(productToFind);
	Product.find({name: {$regex: reg}}, 'name address', function(err, rep){
		if(rep!== null && rep!== undefined && rep.length !== 0) {
			console.log('regexp');
			console.log(rep);
			data.product=rep;
			res.render('searchresult', data);
		} else {
			res.render('searchresult', data);
		}
	});
};

/*functions  of get requests's callbacks for admin*/

module.exports.getCategories = function(req, res){
	var data = {
		category: []
	};
	Category.find({}, function(err, rep){
		if(rep) {
			data.category = rep;
			res.render('categories', data);
		}
	});
};

module.exports.getProductAddForm = function(req, res) {
	var data = {
		category: []
	};
	Category.find({}, function(err, rep){
		if(rep) {
			data.category = rep;
			res.render('productaddform', data);
		}
	});
};

module.exports.getSubcategories = function(req, res){
	var data={
		subcategory: []
	};
	var categoryId = req.query.category;
	Category.findOne({_id: categoryId}, 'subcategory', function(err, rep){
		if(rep) {
			console.log(rep);
			data.subcategory = rep.subcategory;
			res.render('productaddsubcategories', data);
		}
	});
	
};

module.exports.getProductsList = function(req, res){
	var data = {
		products: []
	};
	Product.find({}, 'name address quantity isHit', function(err, rep){
		if(rep) {
				data.products = rep;
				res.render('productslist', data);
		}
	});
};

module.exports.getChangeProductForm = function(req, res){
	var productId = req.query.product;
	Product.findOne({_id: productId}, function(err, rep){
		if (rep) {
				res.render('changeproductform', rep);
		}
	});
};

module.exports.getSpecialPropFormForProduct = function(req, res){
	var data={
		product: []
	};
	Product.find({}, 'name', function(err, rep){
		if(rep){
			data.product = rep;
			res.render('addspecialpropformforproduct', data);
		}
	});
};

module.exports.getSpecialPropsList = function(req, res){
	var data = {
		specialProp: []
	};
	SpecialProp.find({}, function(err, rep){
		if (rep) {
			data.specialProp = rep;
			res.render('specialpropslist', data);
		}
	});
};