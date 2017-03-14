var Callback = require('./models/mongoModel.js').Callback;
var Admin = require('./models/mongoModel.js').Admin;
var Category = require('./models/mongoModel.js').Category;
var Product=require('./models/mongoModel.js').Product;
var Order=require('./models/mongoModel.js').Order;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;
var customFunctions = require('./customfunctions');
var verifyRecaptcha = customFunctions.verifyRecaptcha;
var saveThumbImage = customFunctions.saveThumbImage;
var saveMicroThumbImage=customFunctions.saveMicroThumbImage;
var generateSSID = customFunctions.generateSSID;
var sendEmail = customFunctions.sendEmail;
var formidable = require('formidable');
var easyimg = require('easyimage');
var fs=require('fs-extra');

Order.find({}, function(err, rep){
	console.log(rep);
	console.log(rep[0].product);
});

module.exports.orderCallback = function(req, res){
	var name = req.body['name'];
	var phone = req.body['phone'];
	if(name && phone) {
		var callback = new Callback({name: name, phone: phone}).save()
		//TODO send email to the manager
	}
	res.redirect('/');
};

module.exports.makeOrder = function(req, res) {
	console.log('new order');
	var data = {
		product: []
	};
	var productId;
	var step = 0;
	var totalPrice = 0;
	data.fedex = req.body.fedex;
	if (data.fedex === "pickup") data.outpost = req.body.outpost;
	data.name = req.body.name; 
	data.email = req.body.email;
	data.phone = req.body.phone;
	data.address = req.body.address;
	data.comment = req.body.comment;
	data.date = Date.now();
	var productCount = Number(req.body.productCount);
	for (var i=0; i < productCount; i++){
		productId = req.body['product[' + i + '][_id]'];
		data.product.push({id: productId, name: req.body['product[' + i + '][name]'], howMany: req.body['product[' + i + '][howMany]']});
		if (productId) Product.findOne({_id: productId}, 'price isSpecialProp discount name address image_micro_thumb', function(err, rep){
			if(rep) {
				if (rep.isSpecialProp) 	data.product.forEach(function(productItem){
											if(productItem.name == rep.name) {
												productItem.price = rep.discount; 
												productItem.address = rep.address;
												productItem.image_micro_thumb = rep.image_micro_thumb;
											}
										});
				else data.product.forEach(function(productItem){
						if(productItem.name == rep.name) {
							productItem.price = rep.price;
							productItem.address = rep.address;
							productItem.image_micro_thumb = rep.image_micro_thumb;
						}	
					 });
			}
			step++;
			if(step == productCount) {
				data.product.forEach(function(productItem){
					totalPrice += (Number(productItem.price) * Number(productItem.howMany));
				});
				data.totalPrice = totalPrice;
				var order = new Order(data).save();
				res.end();
				//TODO send email to the manager
			}
		});
	}
};

/*admin post requests*/

module.exports.loginHandler = function (req, res) {
	verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
		if (success) {
				console.log(req.body['login']);
				console.log(req.body['password']);	
				var login = req.body['login'];
				var passwd = req.body['password'];
				var loginUpperCase = login.toUpperCase();
				Admin.findOne({loginUpperCase: loginUpperCase}, 'passwd', function(err, rep){
					try {
						if (rep != null && rep.passwd === passwd) {
							generateSSID(login, function(SSID){
								Admin.update({loginUpperCase: loginUpperCase}, {$set: {'session': SSID}}).exec();
								res.cookie('ssid', SSID, {maxAge: 9000000});
								res.cookie('login', login, {maxAge: 9000000});
								res.redirect('/admin');
							});
						} else {
							res.end('wrong password');
						}
					} catch(e) {
						
					}
				});
					
		} else { 
			res.end("Captcha failed, sorry.");	
		}
	});
};

module.exports.orderToWork = function(req, res){
	var orderId = req.query.order;
	if (orderId) Order.update({_id: orderId}, {$set: {isItNew: false, isActive: true}}).exec();
	//TODO send email to the customer
	res.end();	
};

module.exports.markDoneOrder = function(req, res){
	var orderId = req.query.order;
	if(orderId) Order.update({_id: orderId}, {$set: {isItNew: false, isActive: false}}).exec();
	res.end();
};

module.exports.addCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var categoryToAdd = fields.category;
			var category = new Category({name: categoryToAdd, subcategory: []}).save();
			res.end();
		});
		res.end();
	} catch(e) {}
};

module.exports.addSubCategory = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			console.log(fields);
			var category = fields.category;
			Category.findOne({name: category}, 'currentSubcategoryId', function(err, rep){
				if (rep) {
					var subCatId = rep.currentSubcategoryId + 1;
					var subcategoryName = fields.subcategory;
					var subcategory = {name: subcategoryName, id: subCatId};
					Category.update({name: category}, {$push: {subcategory: subcategory}, $inc: {currentSubcategoryId: 1}}).exec();
				}
			});
		});
		res.end();
	} catch(e) {}
};

module.exports.changeCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var categoryId = fields.categoryId;
			var newName = fields.category;
			Category.update({_id: categoryId}, {$set: {name: newName}}).exec(function(err, rep){
				res.end();
			});
		});
	} catch(e) {}
};

module.exports.changeSubCategory = function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {	
			var categoryId = fields.categoryId;
			var subcategoryId = fields.subcategoryId;
			var newName = fields.subcategory;
			subcategoryId = Number(subcategoryId);
			Category.update({_id: categoryId, 'subcategory.id': subcategoryId}, {$set: {'subcategory.$.name': newName}}).exec(function(err, rep){
				res.end();
			});
		});
	} catch(e){}	
};

module.exports.addProduct = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.uploadDir =__dirname + '/../public/images/products';
		form.parse(req, function(err, fields, files) {
			console.log(fields);
			if (files.upload.size !== 0 && files.upload.size !== undefined) { /*this is the case, where user uploads photo*/
				var thumbFileName = __dirname + '/../public/images/products/' + fields.address + '_thumb.jpg';
				var fileName = __dirname + '/../public/images/products/' + fields.address + '.jpg';
				var htmlFileName = '/images/products/' + fields.address + '.jpg';
				var htmlThumbFileName = '/images/products/' + fields.address + '_thumb.jpg';
				var htmlMicroThumbFileName = '/images/products/' + fields.address + '_micro_thumb.jpg';
				fs.renameSync(files.upload.path, fileName);
				saveThumbImage(fileName, thumbFileName, htmlMicroThumbFileName);
			} else { /*this is the case, where user does not upload photo*/
				var htmlFileName = '/images/products/noimage.jpg';
				var htmlThumbFileName = '/images/products/noimage_thumb.jpg';
			}
			Category.findOne({_id: fields.category}, function(err, rep){
				if(rep) {
					var category={name: rep.name, id: rep._id.toString()}; /*variable to save in product schema. Made toString coz otherwise you can not find Product by category id*/
					var subcategory;
					var subcategories = rep.subcategory;
					
					subcategories.forEach(function(subcat){ /*findig the name of subcategory by id*/
						if(Number(fields.subcategory) === Number(subcat.id))
								subcategory = {name: subcat.name, id: subcat.id};
					});
					
					var product = new Product({name: fields.name, nameUpperCase: fields.name.toUpperCase(), category: category, 
					subcategory: subcategory, address: fields.address, price: fields.price, quantity: Number(fields.quantity),
					description: fields.description, code: fields.code, image: htmlFileName, image_thumb: htmlThumbFileName, image_micro_thumb: htmlMicroThumbFileName}).save();
				}
			});
		});
		res.end();
	} catch(e) {}
};

module.exports.changeProduct = function(req, res){
	try {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.uploadDir =__dirname + '/../public/images/products';
		form.parse(req, function(err, fields, files) {
			console.log(files);
			console.log(files.upload.size);
		    if (files.upload.size !== 0 && files.upload.size !== undefined) { /*this is the case, where user uploads photo*/
				var thumbFileName = __dirname + '/../public/images/products/' + fields.address + '_thumb.jpg';
				var microThumbFileName = __dirname + '/../public/images/products/' + fields.address + '_micro_thumb.jpg';
				var fileName = __dirname + '/../public/images/products/' + fields.address + '.jpg';
				var htmlFileName = '/images/products/' + fields.address + '.jpg';
				var htmlThumbFileName = '/images/products/' + fields.address + '_thumb.jpg';
				var htmlMicroThumbFileName = '/images/products/' + fields.address + '_micro_thumb.jpg';
				fs.renameSync(files.upload.path, fileName);
				saveThumbImage(fileName, thumbFileName, files);
				saveMicroThumbImage(fileName, microThumbFileName, files)
				Product.update({_id: fields.id}, {$set: {name: fields.name,  nameUpperCase: fields.name.toUpperCase(), 
								address: fields.address, price: fields.price, quantity: Number(fields.quantity),
								description: fields.description, code: fields.code,
								image: htmlFileName, image_thumb: htmlThumbFileName, image_micro_thumb: htmlMicroThumbFileName}}).exec();
				res.end();
			} else { /*this is the case, where user does not upload photo*/
				Product.update({_id: fields.id}, {$set: {name: fields.name,  nameUpperCase: fields.name.toUpperCase(), 
								address: fields.address, price: fields.price, quantity: Number(fields.quantity),
								description: fields.description, code: fields.code}}).exec();
				res.end();
			}
		});
	}
	catch (e) {}
};

module.exports.replenishProduct = function(req, res) {
		var form = new formidable.IncomingForm();
		form.type = 'multipart/form-data'
		form.parse(req, function(err, fields, files) {
			var productId = fields.id;
			var quantity = fields.quantity;
			try {
				Product.update({_id: productId}, {$set: {quantity: Number(quantity)}}).exec();
				res.end();
			} catch(e) {}
		});
};

module.exports.makeHit = function(req, res){
	var productId = req.query.product;
	try {
		Product.findOne({_id: productId}, 'isHit', function(err, rep){
			if (rep) {
				var isHit = rep.isHit;
				Product.update({_id: productId}, {$set: {isHit: !isHit}}).exec();
				res.end();
			}
		})
	} catch(e) {}
};

module.exports.addSpecialPropForProduct = function(req, res){
	var target = {type: 'product', id: req.body['product']};
	try {
		Product.findOne({_id: req.body['product']}, 'price address', function(err, rep){
			if(rep) {
				var newPrice = rep.price - (0.01 * rep.price * Number(req.body['discount'])); /*calculates new price by discount*/
				newPrice = Math.floor(newPrice);
				Product.update({_id: req.body['product']}, {$set: {isSpecialProp: true, discount: newPrice}}).exec();
				var specProp = new SpecialProp({describe: req.body['describe'], 
												target: target, 
												durancy: req.body['toDate'], 
												link: '/product/' + rep.address, 
												discount: req.body['discount']}).save();
					}
		});
	} catch(e){}
	res.redirect('/admin');
};

module.exports.addSpecialPropForCategory = function(req, res){
	var target = {type: 'category', id: req.body['category']};
	console.log(target);
	try {
		Product.find({'category.id': target.id}, 'price address', function(err, reps){
			if(reps) {
				reps.forEach(function(rep){
					var newPrice = rep.price - (0.01 * rep.price * Number(req.body['discount']));
					newPrice = Math.floor(newPrice);
					Product.update({_id: rep._id}, {$set: {isSpecialProp: true, discount: newPrice}}).exec();
				});	
			var specProp = new SpecialProp({describe: req.body['describe'], 
											target: target,
											durancy: req.body['toDate'], 
											link: '/category/' + req.body['category'],
											discount: req.body['discount']}).save();
			}
		});
	} catch(e) {}
	res.redirect('/admin');
};

module.exports.markSeenCallback = function(req, res){
	var callbackId = req.query.callback;
	if(callbackId) {
		Callback.update({_id: callbackId}, {$set: {isItNew: false}}).exec();
		res.end();
	}
};