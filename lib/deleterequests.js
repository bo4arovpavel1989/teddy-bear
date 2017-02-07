var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp=require('./models/mongoModel.js').SpecialProp;

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
		res.send('Продукт удален!');
	}
};

module.exports.deleteSpecialProp = function(req, res){
	var specialProp = req.query.specialprop;
	console.log(specialProp);
	SpecialProp.findOne({_id: specialProp}, function(err, rep){
		if(rep){
			console.log(rep);
			if (rep.target.type === 'product') Product.update({_id: rep.target.id}, {$set: {isSpecialProp: 'false'}}).exec();
			else Propduct.update({'category.id': rep.target.id}, {$set: {isSpecialProp: 'false'}}, {multi: true}).exec();	
			SpecialProp.findOne({_id: specialProp}).remove().exec();
		}
	});
	res.end();
};