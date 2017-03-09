var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp=require('./models/mongoModel.js').SpecialProp;
var Callback = require('./models/mongoModel.js').Callback;
var Order = require('./models/mongoModel.js').Order;

module.exports.deleteCategory = function(req, res) {
	var categoryId = req.query.category;
	if (categoryId) Category.find({_id: categoryId}).remove().exec();
			res.end();
};

module.exports.deleteSubCategory = function(req, res) {
	var subCategoryId = req.query.subcategory;
	var parentCategory = req.query.parentcategory;
	subCategoryId = Number(subCategoryId);
	Category.update({_id: parentCategory}, {$pull: {subcategory: {id: subCategoryId}}}, {safe: true}).exec();
	res.end();
};

module.exports.deleteProduct = function(req, res){
	var productId = req.query.product;
	if(productId) Product.find({_id: productId}).remove().exec();
		res.send('Продукт удален!');
};

module.exports.deleteSpecialProp = function(req, res){
	var specialProp = req.query.specialprop;
	console.log(specialProp);
	SpecialProp.findOne({_id: specialProp}, function(err, rep){
		if(rep){
			if (rep.target.type === 'product') Product.update({_id: rep.target.id}, {$set: {isSpecialProp: 'false'}}).exec();
			else Product.update({'category.id': rep.target.id}, {$set: {isSpecialProp: 'false'}}, {multi: true}).exec();	
			SpecialProp.findOne({_id: specialProp}).remove().exec();
		}
	});
	res.end();
};

module.exports.deleteCallback = function(req, res){
	var callbackId = req.query.callback;
	if (callbackId) Callback.find({_id: callbackId}).remove().exec();
	res.end();
};

module.exports.deleteOrder = function(req, res){
	var orderId = req.query.order;
	if (orderId) Order.find({_id: orderId}).remove().exec();
	res.end();
};