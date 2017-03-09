var fs = require('fs-extra');

var orderCallback=require('./postrequests.js').orderCallback;
var makeOrder = require('./postrequests.js').makeOrder;

var loginHandler = require('./postrequests.js').loginHandler;
var orderToWork = require('./postrequests.js').orderToWork;
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
var markDoneOrder = require('./postrequests.js').markDoneOrder;

/*get site pages functions*/
var getFacePage=require('./getrequests.js').getFacePage;
var getSubcategoryPage = require('./getrequests.js').getSubcategoryPage;
var getCategoryPage=require('./getrequests.js').getCategoryPage;
var getStaticPage=require('./getrequests.js').getStaticPage;
var getCartPage=require('./getrequests.js').getCartPage;
var getProductPage=require('./getrequests.js').getProductPage;
/*get components functions*/
var searchProduct=require('./getrequests.js').searchProduct;
var getCallbackForm=require('./getrequests.js').getCallbackForm;

var getOrders = require('./getrequests.js').getOrders;
var getOrderArchive=require('./getrequests.js').getOrderArchive;
var getCategories=require('./getrequests.js').getCategories;
var getProductAddForm=require('./getrequests.js').getProductAddForm;
var getSubcategories=require('./getrequests.js').getSubcategories;
var getProductsList=require('./getrequests.js').getProductsList;
var getChangeProductForm=require('./getrequests.js').getChangeProductForm;
var getSpecialPropFormForProduct = require('./getrequests.js').getSpecialPropFormForProduct;
var getSpecialPropFormForCategory = require('./getrequests.js').getSpecialPropFormForCategory;
var getSpecialPropsList = require('./getrequests.js').getSpecialPropsList;
var getCallbackList=require('./getrequests.js').getCallbackList;

var deleteCategory=require('./deleterequests.js').deleteCategory;
var deleteSubCategory=require('./deleterequests.js').deleteSubCategory;
var deleteProduct=require('./deleterequests.js').deleteProduct;
var deleteSpecialProp = require('./deleterequests.js').deleteSpecialProp;
var deleteCallback=require('./deleterequests.js').deleteCallback;
var deleteOrder=require('./deleterequests.js').deleteOrder;

var checkAccess = require('./middlewarefunctions.js').checkAccess;
var noMiddleware = require('./middlewarefunctions.js').noMiddleware;

var getRequests = [
	{
		url: '/',
		middleware: noMiddleware,
		callback: getFacePage
	},
	{
		url: '/static/:id',
		middleware: noMiddleware,
		callback: getStaticPage
	},
	{
		url: '/cart',
		middleware: noMiddleware,
		callback: getCartPage
	},
	{
		url: '/products/:id',
		middleware: noMiddleware,
		callback: getProductPage
	},
	{
		url: '/category/:id',
		middleware: noMiddleware,
		callback: getCategoryPage
	},
	{
		url: '/subcategory/:id/:subid',
		middleware: noMiddleware,
		callback: getSubcategoryPage
	},
	/*components routes*/
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
	/*admin routes*/
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
		url: '/admin/getorders',
		middleware: checkAccess,
		callback: getOrders
	},
	{
		url: '/admin/getorderarchive',
		middleware: checkAccess,
		callback: getOrderArchive
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
		url: '/makeorder',
		middleware: noMiddleware,
		callback: makeOrder
	},
	/*admin routes*/
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
		url: '/admin/ordertowork',
		middleware: checkAccess,
		callback: orderToWork
	},
	{
		url: '/admin/markdoneorder',
		middleware: checkAccess,
		callback: markDoneOrder
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
	},
	{
		url: '/admin/deleteorder',
		middleware: checkAccess,
		callback: deleteOrder
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