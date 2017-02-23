var fs = require('fs-extra');

var orderCallback=require('./postrequests.js').orderCallback;
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
var addSpecialPropForCategory = require('./postrequests.js').addSpecialPropForCategory;
var markSeenCallback = require('./postrequests.js').markSeenCallback;


var getFacePage=require('./getrequests.js').getFacePage;
var searchProduct=require('./getrequests.js').searchProduct;
var getCallbackForm=require('./getrequests.js').getCallbackForm;
var getCategories=require('./getrequests.js').getCategories;
var getProductAddForm=require('./getrequests.js').getProductAddForm;
var getSubcategories=require('./getrequests.js').getSubcategories;
var getProductsList=require('./getrequests.js').getProductsList;
var getChangeProductForm=require('./getrequests.js').getChangeProductForm;
var getSpecialPropFormForProduct = require('./getrequests.js').getSpecialPropFormForProduct;
getSpecialPropFormForCategory = require('./getrequests.js').getSpecialPropFormForCategory;
var getSpecialPropsList = require('./getrequests.js').getSpecialPropsList;
var getCallbackList=require('./getrequests.js').getCallbackList;

var deleteCategory=require('./deleterequests.js').deleteCategory;
var deleteSubCategory=require('./deleterequests.js').deleteSubCategory;
var deleteProduct=require('./deleterequests.js').deleteProduct;
var deleteSpecialProp = require('./deleterequests.js').deleteSpecialProp;
var deleteCallback=require('./deleterequests.js').deleteCallback;


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
		url: '/getcallbackform',
		middleware: noMiddleware,
		callback: getCallbackForm
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
	},
	{
		url: '/admin/getspecialpropformforcategory',
		middleware: checkAccess,
		callback: getSpecialPropFormForCategory
	},
	{
		url: '/admin/getspecialpropslist',
		middleware: checkAccess,
		callback: getSpecialPropsList
	},
	{
		url: '/admin/getcallbacklist',
		middleware: checkAccess,
		callback: getCallbackList
	}
];

var postRequests = [
	{
		url: '/ordercallback',
		middleware: noMiddleware,
		callback: orderCallback
	},
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
	},
	{
		url: '/admin/addspecialpropforcategory',
		middleware: checkAccess,
		callback: addSpecialPropForCategory
	},
	{
		url: '/admin/markseencallback',
		middleware: checkAccess,
		callback: markSeenCallback
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
	},
	{
		url: '/admin/deletespecialprop',
		middleware: checkAccess,
		callback: deleteSpecialProp
	},
	{
		url: '/admin/deletecallback',
		middleware: checkAccess,
		callback: deleteCallback
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