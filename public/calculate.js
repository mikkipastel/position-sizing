/* HTML */
console.log("test");

function setField(id, value) {
  document.getElementById(id).value = value;
}

function getElementValue(id) {
  var element = document.getElementById(id);
  return element.value;
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