var fs = require('fs-extra');

var loginHandler = require('./postrequests.js').loginHandler;
var addCategory=require('./postrequests.js').addCategory;
var addSubCategory=require('./postrequests.js').addSubCategory;
var changeCategory=require('./postrequests.js').changeCategory;
var changeSubCategory=require('./postrequests').changeSubCategory;

var getCategories=require('./getrequests.js').getCategories;

var deleteCategory=require('./deleterequests.js').deleteCategory;
var deleteSubCategory=require('./deleterequests.js').deleteSubCategory;

var checkAccess = require('./middlewarefunctions.js').checkAccess;
var noMiddleware = require('./middlewarefunctions.js').noMiddleware;

var getRequests = [
	{
		url: '/login',
		middleware: noMiddleware,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/login.html');
		}
	},
	{
		url: '/admin',
		middleware: checkAccess,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/admin.html');
		}
	},
	{
		url: '/getcategories',
		middleware: checkAccess,
		callback: getCategories
	}
];

var postRequests = [
	{
		url: '/login',
		middleware: noMiddleware,
		callback: loginHandler
	},
	{
		url: '/addcategory',
		middleware: checkAccess,
		callback: addCategory
	},
	{
		url: '/addsubcategory',
		middleware: checkAccess,
		callback: addSubCategory
	},
	{
		url: '/changecategory',
		middleware: checkAccess,
		callback: changeCategory
	},
	{
		url: '/changesubcategory',
		middleware: checkAccess,
		callback: changeSubCategory
	}
];

var deleteRequests = [
	{
		url: '/deletecategory',
		middleware: checkAccess,
		callback: deleteCategory
	},
	{
		url: '/deletesubcategory',
		middleware: checkAccess,
		callback: deleteSubCategory
	}
];

var router = function (app) {
	getRequests.forEach(function(request){
		app.get(request.url, request.middleware, request.callback);
	});
	postRequests.forEach(function(request){
		app.post(request.url, request.middleware, request.callback)
	});
	deleteRequests.forEach(function(request){
		app.delete(request.url, request.middleware, request.callback)
	});
};

module.exports.router = router;