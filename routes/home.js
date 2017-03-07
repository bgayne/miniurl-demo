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


  router.get('/', (req, res) => {
    if(req.session.userID !== undefined)
      User.findUserByID(req.session.userID, (err, user) => {
        res.render('partials/html/navbar/nav-auth.html', {uname:user[0].username}, (err, navbar) => {
          res.render('html/short.html', {navbar : navbar}, (err, html) => {
            return res.send(html);
          })
        })
      })
    else
      res.render('partials/html/navbar/nav-unauth.html', (err, partial) => {
        res.render('html/short.html', {navbar : partial}, (err, html) => {
          return res.send(html);
        })
      });
  });

  return router
}
