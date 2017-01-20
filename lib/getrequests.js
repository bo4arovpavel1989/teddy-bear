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

