/* HTML */
getElementValue("inputCoinMame");

function getElementValue(id) {
  var element = document.getElementById(id);
  var idValue = element.value;
  console.log(idValue);
}

/* Formular */

function getTakeProfit(entryPrice, stopLossPrice, multiple) {
  return entryPrice + (multiple * (entryPrice - stopLossPrice));
}

function getAmountBuy(maxLoss, entryPrice, stopLossPrice) {
  return maxLoss / Math.abs(entryPrice - stopLossPrice);
}

function getUsdUses(maxLoss, entryPrice, stopLossPrice, leverage) {
  var amountBuy = getAmountBuy(maxLoss, entryPrice, stopLossPrice);
  return amountBuy * entryPrice / leverage
}