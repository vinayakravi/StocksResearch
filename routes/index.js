var express = require('express');
var stockinfo = require('./stockinfo.js');
var router = express.Router();

/* GET Home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'VR Stock Research' });
});
router.post('/search',function(req,res){
  var ticker=req.body.ticker;

  stockinfo.getStockInfo(ticker,function(err,results){

    res.json(results);
  });

});
module.exports = router;
