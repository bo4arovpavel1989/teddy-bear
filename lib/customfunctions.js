var https = require('https');
var crypto = require('crypto');
var secret = require('./../credentials.js');
var easyimg = require('easyimage');
var fs=require('fs-extra');

var Category = require('./models/mongoModel.js').Category;
var Product = require('./models/mongoModel.js').Product;
var SpecialProp = require('./models/mongoModel.js').SpecialProp;

var getRandomInt = function (min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


setInterval(function(){checkCurrentSpecialProp()}, 1000*60*5);

function checkCurrentSpecialProp() {
	var now = Date.now();
	SpecialProp.find({}, 'durancy target', function(err ,reps){
		if(reps){
			reps.forEach(function(rep){
				if(rep.durancy < now) {
					if (rep.target.type === 'product') Product.update({_id: rep.target.id}, {$set: {isSpecialProp: 'false'}}).exec();
					else Product.update({'category.id': rep.target.id}, {$set: {isSpecialProp: 'false'}}, {multi: true}).exec();	
					SpecialProp.findOne({_id: rep._id}).remove().exec();
				}
			});
		}
	});
}

module.exports.generateSSID = function (login, callback) {
	var sessionItem;
	sessionItem = getRandomInt(1, 100000);
	sessionItem = login + sessionItem;
	var hashSession = crypto.createHmac('sha256', secret.secret)
						.update(sessionItem)
						.digest('hex');
	callback(hashSession);					
};



/*функция прверки капчи*/
var SECRET = "6Lc38CcTAAAAAAH9bGyt70CTNbSar1dTRnzQv3D3";
var verifyRecaptcha = function (key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
        var data = "";
        res.on('data', function (chunk) {
                        data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
};

module.exports.verifyRecaptcha = verifyRecaptcha;

module.exports.saveThumbImage = function(src, dst) {
	easyimg.resize({src: src, dst: dst, width:300, height:300}, function(err, stdout, stderr) {
				console.log('wait for resize result');
				if (err) {
					console.log("Error loading avatar");
					fs.unlink(files.upload.path, function(err){
						console.log("Error loading avatar");
					});
				} 
			}).then(
					function(img) {
						console.log('Resized: ' + img.width + ' x ' + img.height);
					},
					function (err) {
						console.log(err);
						fs.unlink(files.upload.path, function(err){
							console.log("Error resizing, source delete");
						});
					}
			);
};