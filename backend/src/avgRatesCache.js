const common = require('./common.js')
const currListCache = require('./currListCache.js')
const tableType = currListCache.getTableType
const httpGet = common.httpGet
var Holidays = require('date-holidays')
var hd = new Holidays('PL')

const cacheAvg = {}

async function requestNBPAvg(curr, from, to){
  const url = 'https://api.nbp.pl/api/exchangerates/rates/' + tableType(curr) + '/' + curr + '/' + from + '/' + to + '/?format=json'
  const askingDay = await httpGet(url)
  let askingAvgObject
  try {
    askingAvgObject = JSON.parse(askingDay)
  } catch (error) {
    return {err: 'requested object not found'}
  }

  function processResponseNBPAvg(){
    for (let i=0;i<askingAvgObject.rates.length;i++){
      const item = askingAvgObject.rates[i]

      const newItem = {
        date: item.effectiveDate,
        avg: item.mid,
      }
      if(!cacheAvg.hasOwnProperty(curr)){
        cacheAvg[curr] = {data: []}
      }

      const idx = cacheAvg[curr].data.findIndex(obj => obj.date === item.effectiveDate)
      if (idx !== -1){
        cacheAvg[curr].data[idx] = newItem
      } else {
        cacheAvg[curr].data.push(newItem)
      }
    }

    cacheAvg[curr].data.sort( (a, b) => new Date(a.date) - new Date(b.date))
  }
  processResponseNBPAvg()
}

function getAvgFromCache(curr, from, to){

  let findIndexFrom = cacheAvg[curr] && cacheAvg[curr].data.findIndex(obj => obj.date === from)
  let findIndexTo = cacheAvg[curr] && cacheAvg[curr].data.findIndex(obj => obj.date === to)

  if(findIndexFrom === undefined ||
    findIndexTo === undefined ||
    findIndexFrom === -1 ||
    findIndexTo === -1) {
    return null
  }
  else{
    return cacheAvg[curr].data.slice(findIndexFrom, findIndexTo + 1)
  }
}

async function getAvg(curr, from, to){
  const result = getAvgFromCache(curr, from, to)
  if(result){
    return result
  }
  else{
    const result = await requestNBPAvg(curr, from, to)
    if(result){
      return result
    }
    const temp = getAvgFromCache(curr, from, to)
    return temp
  }
}


module.exports = {
  getAvg: getAvg
}
