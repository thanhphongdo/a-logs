var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4400');
  res.json({
    message: 'hello'
  });
});

module.exports = router;
