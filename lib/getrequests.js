var Category = require('./models/mongoModel.js').Category;
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
	
}