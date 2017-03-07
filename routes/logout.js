module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var User = require('../models/user.model.js');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./public'));

  router.get('/', (req, res) => {
    if(req.session.userID !== undefined)
      req.session.destroy();
    res.redirect('/');
  });

  return router
}
