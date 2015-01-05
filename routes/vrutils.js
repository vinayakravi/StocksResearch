exports.getNumericValue = function(str) {
  var suf = str.substring(str.length-1,str.length);
  var number = str.substring(0,str.length-1);
  var multiplier;
  switch(suf) {
    case "B": multiplier = Math.pow(10,9); break;
    case "M": multiplier = Math.pow(10,6); break;
    default: multiplier = 1;
  }
 if(multiplier==1) return parseFloat(number);
 return parseFloat(number)*multiplier;
}
