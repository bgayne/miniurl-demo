module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var User = require('../models/user.model.js');
  var sha1 = require('sha1');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./public'));

  router.get('/', (req, res) => {
    if(req.session.userID)
      res.redirect("/");
    else
      res.sendFile('/html/login.html', {root:'./public'});
  })

  router.post('/', (req, res) => {
    User.findUserByName(req.body.username, (err, user) => {
      console.log(user);
      if(user[0]) {
        user = user[0];
        if(sha1(req.body.password) === user.password) {
          req.session.userID = user.uuid;
          console.log(user);
          res.send({status:"success"});
        }
        else res.send({status:"error", message:"wrong password"});
      }
      else {
        res.send({status:"error", message:"user not found"});
      }
    })
  })

  return router
}
