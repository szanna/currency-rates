const common = require('./common.js')
const httpGet = common.httpGet
var Holidays = require('date-holidays')
var hd = new Holidays('PL')

const cacheBidAsk = {}

async function requestNBPBidAsk(curr, from, to){
  const url = 'https://api.nbp.pl/api/exchangerates/rates/c/' + curr + '/' + from + '/' + to + '/?format=json'
  const askingDay = await httpGet(url)
  let askingBidAskObject
  try {
    askingBidAskObject = JSON.parse(askingDay)
  } catch (error) {
    return {err: 'requested object not found'}
  }

  function processResponseNBPBidAsk(){
    for (let i=0;i<askingBidAskObject.rates.length;i++){
      const item = askingBidAskObject.rates[i]

      const newItem = {
        date: item.effectiveDate,
        bid: item.bid,
        ask: item.ask
      }
      if(!cacheBidAsk.hasOwnProperty(curr)){
        cacheBidAsk[curr] = {data: []}
      }

      const idx = cacheBidAsk[curr].data.findIndex(obj => obj.date === item.effectiveDate)
      if (idx !== -1){
        cacheBidAsk[curr].data[idx] = newItem
      } else {
        cacheBidAsk[curr].data.push(newItem)
      }
    }

    cacheBidAsk[curr].data.sort( (a, b) => new Date(a.date) - new Date(b.date))
  }
  processResponseNBPBidAsk()
}

function getBidAskFromCache(curr, from, to){

  let findIndexFrom = cacheBidAsk[curr] && cacheBidAsk[curr].data.findIndex(obj => obj.date === from)
  let findIndexTo = cacheBidAsk[curr] && cacheBidAsk[curr].data.findIndex(obj => obj.date === to)

  if(findIndexFrom === undefined ||
    findIndexTo === undefined ||
    findIndexFrom === -1 ||
    findIndexTo === -1) {
    return null
  }
  else{
    return cacheBidAsk[curr].data.slice(findIndexFrom, findIndexTo + 1)
  }
}

async function getBidAsk(curr, from, to){
  const result = getBidAskFromCache(curr, from, to)
  if(result){
    return result
  }
  else{
    const result = await requestNBPBidAsk(curr, from, to)
    if(result){
      return result
    }
    const temp = getBidAskFromCache(curr, from, to)
    return temp
  }
}

module.exports = {
  getBidAsk: getBidAsk
}
