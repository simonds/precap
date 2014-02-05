var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findOneById(id).done(function (err, user) {
    if (err) { return done(err); }
    return done(null, user);
  });
});


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      var bcrypt = require('bcrypt');

      User.findOneByEmail(username).done(function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }

        if (user) {
          bcrypt.compare(password, user.password, function (err, match) {
            if (err) { return done(err); }

            if (match) {
              // password match
              return done(null, user);
            } else {
              // invalid password
              return done(null, false, { message: 'Invalid password' });
            }
          });
        }
      });

    });
  }
));
