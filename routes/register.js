module.exports = (express) => {

  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var User = require('../models/user.model.js');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./public'));

  router.get('/', (req, res) => {
    res.sendFile('/html/register.html', {root:'./public'});
  })

  router.post('/', (req, res) => {
    User.newUser(req.body.username, req.body.email, req.body.password, (err, result) => {
        res.send(result);
    })
  })

  return router
}
