module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var mongoose = require('mongoose');
  var Link = require('../models/link.model');
  var User = require('../models/user.model');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use('/', express.static('./public'));

  router.get('/', (req, res) => {
    if(req.session.userID)
      User.findUserByID(req.session.userID, (err, user) => {
        res.render('partials/html/navbar/nav-auth.html', {uname:user[0].username}, (err, navbar) => {
          res.render('html/user.html', {navbar : navbar}, (err, html) => {
            res.send(html);
          })
        })
      })
    else
      res.redirect('/');
  })

  router.post('/', (req, res) => {
      User.findUserByID(req.session.userID, (err, user) => {
        Link.getLinksByUser(req.session.userID, (err, links) => {
          console.log(links);
          console.log(user[0]);
          res.send(links);
        })
      })
  })

  return router
}
