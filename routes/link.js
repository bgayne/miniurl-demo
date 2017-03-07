module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var mongoose = require('mongoose');
  var Link = require('../models/link.model');
  var User = require('../models/user.model');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use('/', express.static('./public/'));

  router.get("/:hash/:password?", (req, res) => {
    Link.getLink(req.params.hash, (err, link) => {
      if(link[0]) {
        link = link[0];
        if(link.privacy.isPrivate)
          if(req.params.password)
            if(sha1(req.params.password) === link.privacy.password) {
              link.log.push({headers:req.headers, timestamp:(Date.now() / 1000)});
              link.clicks++;
              link.save();
              res.redirect(link.target);
            }
            else
              res.redirect("/denied/"+req.params.hash);
          else
            res.redirect("/denied/"+req.params.hash);
        else {
          link.log.push({headers:req.headers, timestamp:(Date.now() / 1000)});
          link.clicks++;
          link.save();
          res.redirect(link.target);
        }
      }
      else {
        res.redirect("/");
      }
    })
  });

  router.post("/", (req, res) => {
    if(req.session.userID)
      User.findUserByID(req.session.userID, (err, user) => {
        Link.newLink(req.body.url, user[0].uuid, (err, link) => {
          user[0].links.push({hash:link.hash});
          user[0].save();
          res.send({url:link.hash});
        })
      })
    else
      Link.newLink(req.body.url, -1, (err, link) => {
        console.log(err);
        console.log(link);
        res.send({url:link.hash});
      })
  })

  return router
}
