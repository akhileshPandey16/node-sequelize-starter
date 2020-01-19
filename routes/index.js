var express = require('express');
var router = express.Router();
const controller = require('./../controllers/index')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login',controller.auth.login)
router.post('/sign-up',controller.auth.signup)







module.exports = router;
