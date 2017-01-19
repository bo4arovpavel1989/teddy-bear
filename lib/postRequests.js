var Admin = require('./models/mongoModel.js').Admin;
var customFunctions = require('./customfunctions');
var verifyRecaptcha = customFunctions.verifyRecaptcha;
var generateSSID = customFunctions.generateSSID;

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
}