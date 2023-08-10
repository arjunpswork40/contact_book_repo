const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtConfig = require('./jwt');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret
};

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    // Here, you can fetch user data from your database based on jwtPayload.sub (user ID)
    // and call the `done` callback with the user object if found, or false if not.
    // For simplicity, we'll assume the user is authenticated in this example.
    const user = { id: jwtPayload.sub };
    done(null, user);
}));

module.exports = passport;
