/* eslint-disable no-undef */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { connectDb } = require("./database/mongoConnector");
const { makeJsonResponse } = require("./utils/response");
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwtAuth = require("./app/middlewares/auth/jwt-auth")
const app = express();

//routes

// API Routes

const contactsRouter = require("./routes/api/contacts/contactsRouter")
const loginRouter = require("./routes/api/auth/loginRouter")
const logoutRouter = require("./routes/api/auth/logoutRouter")
const createDemoUser = require("./routes/api/auth/demoUser")

// view engine setup
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const store = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/ente-anagamaly',
  collection: 'sessions'
});

store.on('error', function (error) {
  console.log(error);
});


// Set up session middleware
app.use(session({
  secret: 'session_secret_value',
  resave: true,
  saveUninitialized: true,
  store: store
}));

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(passport.authenticate('session'));
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


connectDb();

// API Routes
app.use("/contacts", jwtAuth, contactsRouter)
app.use("/login", loginRouter)
app.use("/logout", jwtAuth, logoutRouter)
app.use("/create-demo-user", createDemoUser)


// // error handler
// app.use(function (err, req, res) {
//   const httpStatusCode = 403;
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   const response = makeJsonResponse(err?.message, {}, {}, httpStatusCode, false);
//   res.status(httpStatusCode).json(response);
// });

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
