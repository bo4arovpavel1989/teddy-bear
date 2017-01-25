var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
/*functions  of get requests's callbacks*/


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
	Product.find({}, 'name address', function(err, rep){
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