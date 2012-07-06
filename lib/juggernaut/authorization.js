var authorization = function(path, sessionName){
  if(!path || !sessionName){
    throw "You must specify a path and session name.";
  }
  return function(handshake, callback){

    console.log('AUTHORIZATION');
    var cookieParser = function(str){
      var cookies = {};
      str.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
      });
      return cookies;
    }

    var http = require('http');
      if(handshake.headers.cookie){
        var cookie = cookieParser(handshake.headers.cookie);
        http.get(path+cookie[sessionName], function(httpres) {
          httpres.on("data", function(chunk) {
            var result = JSON.parse(chunk);
            handshake.auth = result;
              callback(null, result.access === true);
            });
        }).on('error', function(e) {
          callback(null, false);
        });
      }
          
  };
}
module.exports = authorization;