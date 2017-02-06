var fs = require('fs-extra');

var loginHandler = require('./postrequests.js').loginHandler;
var addCategory=require('./postrequests.js').addCategory;
var addSubCategory=require('./postrequests.js').addSubCategory;
var changeCategory=require('./postrequests.js').changeCategory;
var changeSubCategory=require('./postrequests').changeSubCategory;
var addProduct=require('./postRequests.js').addProduct;
var changeProduct=require('./postrequests.js').changeProduct;
var replenishProduct=require('./postrequests.js').replenishProduct;
var makeHit = require('./postrequests.js').makeHit;
var addSpecialPropForProduct=require('./postrequests.js').addSpecialPropForProduct;

var getFacePage=require('./getrequests.js').getFacePage;
var searchProduct=require('./getrequests.js').searchProduct;
var getCategories=require('./getrequests.js').getCategories;
var getProductAddForm=require('./getrequests.js').getProductAddForm;
var getSubcategories=require('./getrequests.js').getSubcategories;
var getProductsList=require('./getrequests.js').getProductsList;
var getChangeProductForm=require('./getrequests.js').getChangeProductForm;
var getSpecialPropFormForProduct = require('./getrequests.js').getSpecialPropFormForProduct;

var deleteCategory=require('./deleterequests.js').deleteCategory;
var deleteSubCategory=require('./deleterequests.js').deleteSubCategory;
var deleteProduct=require('./deleterequests.js').deleteProduct;


var checkAccess = require('./middlewarefunctions.js').checkAccess;
var noMiddleware = require('./middlewarefunctions.js').noMiddleware;

var getRequests = [
	{
		url: '/',
		middleware: noMiddleware,
		callback: getFacePage
	},
	{
		url: '/searchproduct',
		middleware: noMiddleware,
		callback: searchProduct
	},
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
		url: '/admin/getcategories',
		middleware: checkAccess,
		callback: getCategories
	},
	{
		url: '/admin/getproductaddform',
		middleware: checkAccess,
		callback: getProductAddForm
	},
	{
		url: '/admin/getsubcategories',
		middleware: checkAccess,
		callback: getSubcategories
	},
	{
		url: '/admin/getproductslist',
		middleware: checkAccess,
		callback: getProductsList
	},
	{
		url: '/admin/getchangeproductform',
		middleware: checkAccess,
		callback: getChangeProductForm
	},
	{
		url: '/admin/getspecialpropformforproduct',
		middleware: checkAccess,
		callback: getSpecialPropFormForProduct
	}
];

var postRequests = [
	{
		url: '/admin',
		middleware: checkAccess,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/admin.html');
		}
	},
	{
		url: '/login',
		middleware: noMiddleware,
		callback: loginHandler
	},
	{
		url: '/admin/addcategory',
		middleware: checkAccess,
		callback: addCategory
	},
	{
		url: '/admin/addsubcategory',
		middleware: checkAccess,
		callback: addSubCategory
	},
	{
		url: '/admin/changecategory',
		middleware: checkAccess,
		callback: changeCategory
	},
	{
		url: '/admin/changesubcategory',
		middleware: checkAccess,
		callback: changeSubCategory
	},
	{
		url: '/admin/addproduct',
		middleware: checkAccess,
		callback: addProduct
	},
	{
		url: '/admin/changeproduct',
		middleware: checkAccess,
		callback: changeProduct
	},
	{
		url: '/admin/replenishproduct',
		middleware: checkAccess,
		callback: replenishProduct
	},
	{
		url: '/admin/makehit',
		middleware: checkAccess,
		callback: makeHit
	},
	{
		url: '/admin/addspecialpropforproduct',
		middleware: checkAccess,
		callback: addSpecialPropForProduct
	}
];

var deleteRequests = [
	{
		url: '/admin/deletecategory',
		middleware: checkAccess,
		callback: deleteCategory
	},
	{
		url: '/admin/deletesubcategory',
		middleware: checkAccess,
		callback: deleteSubCategory
	},
	{
		url: '/admin/deleteproduct',
		middleware: checkAccess,
		callback: deleteProduct
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