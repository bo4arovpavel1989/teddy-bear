var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;
var Callback=require('./models/mongoModel.js').Callback;
var async= require('async');
var textSearch = require('mongoose-text-search');
var getCommonData=require('./customfunctions.js').getCommonData;

/*get different pages of the site*/

module.exports.getFacePage = function(req, res){
	var data = {
		layout: 'main',
		product: []
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Product.find({isHit: true}, function(err, rep){
				if(rep) data.product = rep;
				callback();
			})
		},
		], function(err) { 
			res.render('pages/index', data);
	});
};

module.exports.getProductPage = function(req, res){
	var data = {
		layout: 'main',
		product: {}
	};
	var productAddress = req.params.id;
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Product.findOne({address: productAddress}, function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/productpage', data);
	});	
};

module.exports.getCategoryPage = function(req, res){
	var categoryId = req.params.id;
	var data = {
		layout: 'main',
		product: [],
		title: {}
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Category.findOne({_id: categoryId}, function(err, rep){
				if(rep) data.title.name = rep.name;
				callback();
			});
		},
		function(callback) {
			Product.find({'category.id': categoryId}, function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/categorypage', data);
	});	
};

module.exports.getSubcategoryPage = function(req, res){
	var categoryId = req.params.id;
	var subcategoryId = req.params.subid;
	var data = {
		layout: 'main',
		product: [],
		title: {}
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		},
		function(callback) {
			Category.findOne({_id: categoryId}, function(err, rep){
				if(rep) {
					data.title.name = rep.name;
					var subcategories = rep.subcategory;
					subcategories.forEach(function(subcat){ /*findig the name of subcategory by id*/
						if(Number(subcategoryId) === Number(subcat.id))
								data.title.subcatname = subcat.name;
					});
				}
				callback();
			});
		},
		function(callback) {
			Product.find({'category.id': categoryId, 'subcategory.id': Number(subcategoryId)}, function(err, rep){
				if(rep) data.product = rep;
				callback();
			});
		}
		], function(err) { 
			res.render('pages/categorypage', data);
	});
};

module.exports.getFedexPage = function(req, res){
	var data = {
		layout: 'main'
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/fedex', data);
	});
};

module.exports.getContactsPage = function(req, res){
	var data = {
		layout: 'main'
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/contacts', data);
	});
};

module.exports.getArticlesPage = function(req, res){
	var data = {
		layout: 'main'
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/articles', data);
	});
};

module.exports.getAboutPage = function(req, res){
	var data = {
		layout: 'main'
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/about', data);
	});
};

module.exports.getHowOrderPage = function(req, res){
	var data = {
		layout: 'main'
	};
	async.parallel([
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/howorder', data);
	});
};

module.exports.getCartPage = function(req, res){
	var data = {
		layout: 'main',
		product: []
	};
	if(req.cookies.cart) {
		var cart = req.cookies.cart;
		var index;
		var controlCartArray = []; /*added this array to control if products dublicate*/
		cart = cart.split(', ');
		async.parallel([
		function(callback) {
			var counter = cart.length; /*added this to keep the moment when tle last product adds to data array*/
			cart.forEach(function(cartItem){
					Product.findOne({_id: cartItem}, function(err, rep){
						if (rep) {
							index = controlCartArray.indexOf(rep.name); /*check if current product doesnt dublicate in control array*/
							console.log(index);
							if (index === -1) { /*current product doesnt dublicate, so i add it to the cart and to the control array*/
								controlCartArray.push(rep.name);
								rep.howMany = 1;
								data.product.push(rep);						
							} else { /*current product dublicates so i search it in the cart and increment its quantity by 1*/
								for(var i=0; i < data.product.length; i++) {
									if (rep.name === data.product[i].name) data.product[i].howMany++;
								}
							}	
						}
						counter--;
						if(counter === 0) callback(); /*make callback when the last product adds to data array*/
					});
			});
		},
		function(callback) { 
			getCommonData(data, function(err, rep){
				if(rep) callback();
			});
		}
		], function(err) { 
			res.render('pages/cart', data);
		});
	}
};

/*page components render functions*/

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
			res.render('components/searchresult', data);
		} else {
			res.render('components/searchresult', data);
		}
	});
};

module.exports.getCallbackForm = function(req, res){
	res.render('forms/callbackform');
};


/*functions  of get requests's callbacks for admin*/

module.exports.getCategories = function(req, res){
	var data = {
		category: []
	};
	Category.find({}, function(err, rep){
		if(rep) {
			data.category = rep;
			res.render('components/categories', data);
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
			res.render('forms/productaddform', data);
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
			res.render('components/productaddsubcategories', data);
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
				res.render('components/productslist', data);
		}
	});
};

module.exports.getChangeProductForm = function(req, res){
	var productId = req.query.product;
	Product.findOne({_id: productId}, function(err, rep){
		if (rep) {
				res.render('forms/changeproductform', rep);
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
			res.render('forms/addspecialpropformforproduct', data);
		}
	});
};

module.exports.getSpecialPropFormForCategory = function(req, res){
	var data = {
		category: []
	};
	Category.find({}, 'name', function(err, rep){
		if(rep){
			data.category = rep;
			res.render('forms/addspecialpropformforcategory', data);
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
			res.render('components/specialpropslist', data);
		}
	});
};

module.exports.getCallbackList = function(req, res){
	var data={
		callback: []
	};
	Callback.find({}, function(err, rep){
		if(rep){
			data.callback = rep.reverse();
			res.render('components/callbacklist', data);
		}
	});
};