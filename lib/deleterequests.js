var Category = require('./models/mongoModel.js').Category;

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