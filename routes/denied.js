

  module.exports = (express) => {

    var router = express.Router();
    var session = require('express-session');
    var bodyparser = require('body-parser');
    var User = require('../models/user.model.js');
    var Link = require('../models/link.model.js');
    var sha1 = require('sha1');

    router.use(bodyparser.json());
    router.use(bodyparser.urlencoded({extended:true}));
    router.use("/", express.static('./public'));

    router.get('/:redirect?', (req, res) => {
      if(req.params.redirect === undefined)
        return res.redirect('/');
      if(req.session.userID !== undefined)
        User.findUserByID(req.session.userID, (err, user) => {
          res.render('partials/html/navbar/nav-auth.html', {uname:user[0].username}, (err, navbar) => {
            res.render('html/denied.html', {navbar : navbar, deniedid : req.params.redirect}, (err, html) => {
              return res.send(html);
            })
          })
        });
      else
        res.render('partials/html/navbar/nav-unauth.html', (err, partial) => {
          res.render('html/denied.html', {navbar : partial, deniedid: req.params.redirect }, (err, html) => {
            return res.send(html);
          })
        });

    })

    router.post('/', (req, res) => {
      if(req.body.password === undefined) {
        res.send({status:"error", message:"incorrect password"});
      }
      if(req.body.url === undefined) {
        res.send({status:"error", message:"url not supplied"});
      }
      Link.getLink(req.body.url, (err, link) => {
        if(link[0]) {
          if(link[0].privacy.isPrivate)
            if(link[0].privacy.password == sha1(req.body.password))
              res.send({status:"success",message:link[0].target});
            else res.send({status:"error",message:"incorrect password"});
          else res.send({status:"error", message:"private links only"});
        }
        else res.send({status:"error", message:"link does not exist"});
      })

    })

    return router
  }
