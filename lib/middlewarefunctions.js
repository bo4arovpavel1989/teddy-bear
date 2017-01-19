var Admin = require('./models/mongoModel.js').Admin;
/*middleware functions*/
module.exports.noMiddleware = function(req, res, next){
	next();
};

module.exports.checkAccess = function(req, res, next){
	console.log(req.cookies);
	if(!req.cookies || !req.cookies.ssid || !req.cookies.login) {
			console.log('check failed');
			res.redirect('/login');
	} else {
		var login = req.cookies.login;
		var session = req.cookies.ssid;
		var answer
		Admin.findOne({loginUpperCase: login.toUpperCase()}, 'session', function(err, rep){
			try {
				if (rep){
					answer = (session === rep.session) ? true : false;
					if (answer) {
						next();
					} else {
						res.redirect('/login');
					}
				}
			} catch(e) {}
		});
	}	
};