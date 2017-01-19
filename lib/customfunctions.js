var https = require('https');
var crypto = require('crypto');
var secret = require('./../credentials.js');

var getRandomInt = function (min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


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
