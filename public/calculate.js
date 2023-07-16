/* HTML */

function calculateLossPerOrder() {
  
}

function calculateAll() {
  var maxLoss = getElementValue("inputMaxLoss");
  var leverage = getElementValue("inputLeverage");
  var entryPrice = getElementValue("inputEntryPrice");
  var stopLossPrice = getElementValue("inputStopLossPrice");
  
  var getTakeProfit3x = getTakeProfit(entryPrice, stopLossPrice, 3);
  var getTakeProfit5x = getTakeProfit(entryPrice, stopLossPrice, 5);
  var amountBuy = getAmountBuy(maxLoss, entryPrice, stopLossPrice);
  var usdUses = getUsdUses(amountBuy, entryPrice, leverage);
  
  setField("resultTaskeProfit3x", getTakeProfit3x);
  setField("resultTaskeProfit5x", getTakeProfit5x);
  setField("resultAmountBuy", amountBuy);
  setField("resultUsdUses", usdUses);
}

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

function getUsdUses(amountBuy, entryPrice, leverage) {
  return amountBuy * entryPrice / leverage;
}