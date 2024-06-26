const passport = require('passport')

exports.sanitizeUser = (user) => {

    return { id: user.id, role: user.role };
  };

  exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
  };


  exports.cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

