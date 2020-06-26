const common = require('./common.js')
const httpGet = common.httpGet

const namesList = []
const tableType = {}


async function fetch(){

  function processData(data) {
    for(var i=0;i<data[0].rates.length;i++){
      var item = data[0].rates[i]
      namesList.push({
        code: item.code,
        label: item.currency
      })
      let code = item.code.toLowerCase()
      let table = data[0].table.toLowerCase()
      tableType[code] = table
    }
  }

  var dataA = await httpGet('https://api.nbp.pl/api/exchangerates/tables/a?format=json')
  processData(JSON.parse(dataA))

  // var dataB = await httpGet('https://api.nbp.pl/api/exchangerates/tables/b?format=json')
  // processData(JSON.parse(dataB))
}

function getCurrencyList(){
  return namesList
}

function getTableType(curr){
  console.log(tableType)
  return tableType[curr.toLowerCase()]
}

module.exports = {
  getCurrencyList: getCurrencyList,
  getTableType: getTableType
};

fetch()
