/* Auto Calculate */

function calculateLossPerOrder() {
  var startFund = getElementValue("inputStartFund");
  var riskPercentPerOrder = getElementValue("inputRiskPerOrder");
  
  var losrPerOrder = getLossPerOrder(startFund, riskPercentPerOrder);
  setField("resultLossPerOrder", losrPerOrder);
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
  
  setField("resultTakeProfit3x", getTakeProfit3x);
  setField("resultTakeProfit5x", getTakeProfit5x);
  setField("resultAmountBuy", amountBuy);
  setField("resultUsdUses", usdUses);
}

/* HTML */

function setField(id, value) {
  document.getElementById(id).value = value;
}

function getElementValue(id) {
  var element = document.getElementById(id);
  return element.value;
}

/* Formular */

function getLossPerOrder(startFund, riskPercentPerOrder) {
  return (startFund / 100) * riskPercentPerOrder;
}

function getTakeProfit(entryPrice, stopLossPrice, multiple) {
  var diffEntryStopLoss = (entryPrice - stopLossPrice).toFixed(2);
  var multipleWithDiff = (multiple * diffEntryStopLoss).toFixed(2);
  return Number(entryPrice) + Number(multipleWithDiff);
}

function getAmountBuy(maxLoss, entryPrice, stopLossPrice) {
  return (maxLoss / Math.abs(entryPrice - stopLossPrice)).toPrecision(4);
}

function getUsdUses(amountBuy, entryPrice, leverage) {
  return (amountBuy * entryPrice / leverage).toPrecision(4);
}