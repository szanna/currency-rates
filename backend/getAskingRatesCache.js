const common = require('./common.js')
const bidAskRatesCache = require('./bidAskRatesCache.js')
const avgRatesCache = require('./avgRatesCache.js')
const httpGet = common.httpGet
const getBidAsk = bidAskRatesCache.getBidAsk
const getAvg = avgRatesCache.getAvg

var Holidays = require('date-holidays')
var hd = new Holidays('PL')

function substractDays(date, daysToSubstract){
  const newDay = new Date(date)
  newDay.setDate(newDay.getDate() - daysToSubstract)
  return newDay.toISOString().split('T')[0]
}

function checkHolidays(date){
  const dateObject = new Date(date)
  const holiday = hd.isHoliday(dateObject) !== false
  const weekend = dateObject.getDay() === 0 || dateObject.getDay() === 6
  return holiday || weekend
}

function validateDate(from, to){
  function findWorkingDay(date){

    const checkHoliday = checkHolidays(date)
    if(checkHoliday){
      const prevDate = substractDays(date, 1)
      return findWorkingDay(prevDate)
    }
    return date
  }
  const checkTo = checkHolidays(to)
  if(checkTo){
    return null
  }
  if (from){
    const dfrom = findWorkingDay(from)
    return {from: dfrom, to}
  }
}

async function processReceivedData(params){

  const toDate = params.date
  const currency = params.curr
  const fromDate = substractDays(toDate, 1)

  if (params.rateType === 'optionAvg'){
    const corrected = validateDate(fromDate, toDate)
    if (corrected){
     const result = await getAvg(currency, corrected.from, corrected.to)
     return {
       headers: [
           {name: 'Waluta', key: 'curr', curr: currency},
           {name: 'Data', key: 'date'},
           {name: 'Kurs średni/MID', key: 'avg'},
         ],
       rows:result
       }
   } else {
     return {err: 'date is invalid'}
   }
  }
  else if (params.rateType === 'optionBidAsk'){
   const corrected = validateDate(fromDate, toDate)
   if (corrected){
    const result = await getBidAsk(currency, corrected.from, corrected.to)
    return {
      headers: [
          {name: 'Waluta', key: 'curr', curr: currency},
          {name: 'Data', key: 'date'},
          {name: 'Kurs sprzedaży/BID', key: 'bid'},
          {name: 'Kurs kupna/ASK', key: 'ask'}
        ],
      rows:result
      }
  } else {
    return {err: 'date is invalid'}
  }
  }
}

module.exports = {
  processReceivedData: processReceivedData
}
