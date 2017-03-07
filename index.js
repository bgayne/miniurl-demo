var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var hogan = require('hogan-express');


var User = require('./models/user.model.js');

mongoose.connect("mongodb://localhost:27017/miniurl");

app.engine('html', hogan);

app.use(express.static(__dirname + 'public/'));

app.set('views', __dirname+"/public/");
app.set('view engine', 'html');

app.use(session({
  secret: "Is it secret? Is it safe?",
  resave: false,
  saveUninitialized: false,
  cookie : {
    secure : false,
    expires : false
  }
}))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use("/", require('./routes/home')(express));
app.use("/login", require("./routes/login")(express));
app.use("/logout", require("./routes/logout")(express));
app.use("/register", require('./routes/register')(express));
app.use("/user", require('./routes/user')(express));
app.use("/l", require('./routes/link')(express));
app.use("/p", require('./routes/private')(express));
app.use("/denied", require('./routes/denied')(express));


app.listen(3000, () => { console.log("Listening on port 3000!"); });
