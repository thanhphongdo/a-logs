var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', function (req, res, next) {
    res.json({
        message: 'hello'
    });
});

/* GET users listing. */
router.post('/', function (req, res, next) {
    var data = {
        "url": req.body.url,
        "method": req.body.method,
        "responseTime": req.body.responseTime,
        "header": req.body.header,
        "payload": req.body.payload,
        "productCode": req.body.productCode,
        "error": req.body.error
    };

    var config = {
        method: 'post',
        url: 'http://localhost:3001/parse/functions/save-logs',
        headers: {
            'X-Parse-Application-Id': 'myAppId',
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            res.json({ error: error });
        });
    // console.log(data)
    // res.json({a: 1})
});

module.exports = router;
