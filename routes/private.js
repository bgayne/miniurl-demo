module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var mongoose = require('mongoose');
  var sha1 = require('sha1');
  var Link = require('../models/link.model');
  var User = require('../models/user.model');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use('/', express.static('./public/'));


  router.get("/:hash/:password?", (req, res) => {
    if(req.params.password === undefined)
      res.redirect('/denied/'+req.params.hash);
    Link.getLink(req.params.hash, (err, link) => {
      if(link[0]) {
        link = link[0];
        if(link.privacy.isPrivate === true) {
          if(sha1(req.params.password) === link.privacy.password) {
            res.redirect(link.target);
          }
          else
            res.redirect('/denied/'+req.params.hash);
        }
        else
          res.redirect('/l/'+req.params.hash);
      }
      else
        return res.redirect('/l/error');

    })
  })

  router.post("/", (req, res) => {
    console.log("Hello?");
    if(req.session.userID === undefined) {
      res.send({status:"error", message:"user must be logged in"});
    }
    else {
      User.findUserByID(req.session.userID, (err, user) => {
        if(user[0]) user = user[0];
        else res.send({status:"error", message:"user not found"});
        Link.newPrivateLink(req.body.url, req.session.userID,     req.body.password, (err, link) => {
          console.log(link);
          res.send({status:"success", hash:link.hash});
        })
      })
    }
  })


  return router
}
