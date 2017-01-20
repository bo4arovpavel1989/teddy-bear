var Category = require('./models/mongoModel.js').Category;

module.exports.deleteCategory = function(req, res) {
	var categoryId = req.query.category;
	console.log(categoryId);
	if (categoryId) {
			Category.find({_id: categoryId}).remove().exec();
	}
};