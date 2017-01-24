var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;

module.exports.deleteCategory = function(req, res) {
	var categoryId = req.query.category;
	console.log(categoryId);
	if (categoryId) {
			Category.find({_id: categoryId}).remove().exec();
			res.end();
	}
};

module.exports.deleteSubCategory = function(req, res) {
	var subCategoryId = req.query.subcategory;
	var parentCategory = req.query.parentcategory;
	subCategoryId = Number(subCategoryId);
	console.log(subCategoryId);
	console.log(parentCategory);
	Category.update({_id: parentCategory}, {$pull: {subcategory: {id: subCategoryId}}}, {safe: true}).exec();
	res.end();
};

module.exports.deleteProduct = function(req, res){
	var productId = req.query.product;
	if(productId) {
		Product.find({_id: productId}).remove().exec();
		res.end();
	}
};