// const express = require("express");
// const mongoose = require("mongoose");
// const passport = require("passport");
// const cookieParser = require("cookie-parser");
// const app = express();
// // Load Routes
// const auth = require("./routes/auth")
// // Load user model
// require("./model/Users")
// // Passport config
// require("./config/passport")(passport)
// // Importing connect-flash
// const flash = require("connect-flash");
// // Importing session
// const session = require("express-session");


// // Middleware for cookie parser
// app.use(cookieParser());
// // Middleware for express sessions
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true
//     // check what this is for
//     // cookie: { secure: true }
//   })
// );
// // middleware for passport
// app.use(passport.initialize());
// app.use(passport.session());
// // Middleware for flash
// app.use(flash());

// const keys = require("./config/keys")
// app.get("/", (req, res) => {
//   res.send(`It works`);
// });

// // mongoose.connect(keys.mongoURI,{
// //   useNewUrlParser: true

// // }).then(()=>
// //   console.log("Mongodb connect")
// // ).catch(err => console.log(err))
// mongoose
//   .connect(
//     keys.mongoURI,
//     {
//       useNewUrlParser: true
//     }
//   )
//   .then(() => {

//     console.log("Mongo Connected");
//   })
//   .catch(() => {
//     console.log("Error");
//   });
//  // Load routes
// app.use('/auth',auth);

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
// Initialising express-handlebars
const exphbs = require("express-handlebars");

// Load User Model
require('./model/Users');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Load Keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  // useMongoClient:true
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
// Handlebars middleware
app.engine('handlebars',exphbs({
  defaultLayout: "main"
}));
app.set("view engine","handlebars");

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use('/',index);
app.use('/auth', auth);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});