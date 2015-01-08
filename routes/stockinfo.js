var request     = require('request');
var cheerio     = require('cheerio');
var utils = require('./vrutils.js');
exports.getStockInfo = function(ticker,callback) {
// Some parameters
// TODO: move from the global scope

var yUrl    = "http://finance.yahoo.com/q/ks?s=" + ticker;
var financeDetails = new Array();
var keyStr         = new Array();
var stats = new Array();
var freeCashFlow,shares,tmp;
//
// The main call to fetch the data, parse it and work on it.
//
request(yUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    tmp = $('.time_rtq_ticker').children().first().text();
    tmp = tmp.replace(",","");
    price = parseFloat(tmp);
    console.log(tmp);
    // the keys - We get them from a certain class attribute
    var td = $('.yfnc_tablehead1');
    $(td).each(function(j, val) {
      keyStr[j] = $(val).text();
    });

    // the values
    // TODO: normalize them
    var tData = $('.yfnc_tabledata1');
    $(tData).each(function(j, val) {
      financeDetails[j] = $(val).text();
    });

    freeCashFlow = utils.getNumericValue(financeDetails[30]);
    shares = utils.getNumericValue(financeDetails[40]);

    stats.push({name:"Free Cash Flow per Share",notes:"Higher free cash flow, low share price indicator of increase of price in future",value:(freeCashFlow/(shares *1.0)).toFixed(3)});
    stats.push({name:"Current Ratio (mrq)",notes:"Atleast 2:1",value:financeDetails[27]});
    stats.push({name:"Profit Margin",notes:"Indicator of good management",value:financeDetails[11]});
    stats.push({name:"Price/Book",notes:"less than 1 is good but book value isn't represenative of company's worth",value:financeDetails[6]});
    stats.push({name:"Trailing P/E",notes:"Risky to trade with High trailing P/E",value:financeDetails[2]});
    stats.push({name:"Forward P/E",notes:"Forward P/E should be less than Trailing P/E",value:financeDetails[3]});
    stats.push({name:"Price/Sales",notes:"choose one that has a lower PSR when comparing stocks. companies can't manipulate sales likes earnings",value:financeDetails[5]});
    stats.push({name:"Price/Free Cash Flow",notes:"good indicator of low valuation",value:Math.round(price/((freeCashFlow/shares)*1.0))});
    stats.push({name:"Return On Equity",notes:"good indicator of success, look for greater than 20",value:financeDetails[14]});
    stats.push({name:"% Held by Insiders",notes:"",value:financeDetails[42]});
    stats.push({name:"Current Price",notes:"",value:"$" +price});
    stats.push({name:"52 week Low",notes:"",value:"$"+financeDetails[35]});
    stats.push({name:"52 week High",notes:"",value:"$"+financeDetails[34]});
    stats.push({name:"Qurterly Revenue Growth",notes:"",value:financeDetails[17]});

    callback(null,stats);
  }
  else callback("error",null);
} ); // -- end of request --
}
