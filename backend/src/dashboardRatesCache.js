const common = require('./common.js')
const httpGet = common.httpGet

var mainRates = {}
var lastUpdateDate = 0
const waitSeconds = 10



async function fetch(){

  mainRates = {
    usd: await getCurrencyData('usd'),
    eur: await getCurrencyData('eur'),
    chf: await getCurrencyData('chf'),
    gbp: await getCurrencyData('gbp'),
  }

  lastUpdateDate = Date.now()

  async function getCurrencyData(currency){
    var avgStr = await httpGet('https://api.nbp.pl/api/exchangerates/rates/a/' + currency + '/last/2/?format=json')
    var rateStr = await httpGet('https://api.nbp.pl/api/exchangerates/rates/c/' + currency + '/last/2/?format=json')

    var averageRate = JSON.parse(avgStr)
    var buySellRate = JSON.parse(rateStr)
    var result = {}

    const last = {
      date: averageRate.rates[1].effectiveDate,
      mid: averageRate.rates[1].mid,
      bid: buySellRate.rates[1].bid,
      ask: buySellRate.rates[1].ask,
    }

    const beforeLast = {
      date: averageRate.rates[0].effectiveDate,
      mid: averageRate.rates[0].mid,
      bid: buySellRate.rates[0].bid,
      ask: buySellRate.rates[0].ask,
    }

    const diffMid = last.mid - beforeLast.mid
    const diffBid = last.bid - beforeLast.bid
    const diffAsk = last.ask - beforeLast.ask


    result['date'] = last.date
    result['mid'] = last.mid
    result['bid'] = last.bid
    result['ask'] = last.ask
    result['diffMid'] = diffMid
    result['diffBid'] = diffBid
    result['diffAsk'] = diffAsk

    return result
  }
}


async function getMainRates(){

  const today = Date.now()
  const diffDates = today - lastUpdateDate

  if (diffDates < waitSeconds*1000){
    return mainRates
  } else {
    await fetch()
    return mainRates
  }
}


module.exports = {
  getMainRates: getMainRates
};

fetch()
