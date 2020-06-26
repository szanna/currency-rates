const http = require('http');
const https = require('https');
const currListCache = require('./currListCache.js')
const dashboardRatesCache = require('./dashboardRatesCache.js')
const askingRatesCache = require('./getAskingRatesCache.js')
const common = require('./common.js')
const httpGet = common.httpGet

const hostname = '192.168.2.6';
const port = 3001;

/**
    SERVER LOGIC
**/

// -------get today's rates-------//
async function getMainCurrenciesRates(res){

  var result = await dashboardRatesCache.getMainRates()

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(result));
}



// -------get currency names-------//
async function getList(res){

  const resultList = currListCache.getCurrencyList()

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(resultList));
}


// -------process request from client - object with data to present-------//
async function getTable(params, res){
  console.log(params)
  const resultObject = await askingRatesCache.processReceivedData(params)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify (resultObject))
}


 //----- main server function------//
function listener(req, res, content) {

  if(req.url === '/currencynames' && req.method === 'GET') {
    getList(res)
    return
  }

  if(req.url === '/maincurrencies' && req.method === 'GET') {
    getMainCurrenciesRates(res)
    return
  }

  if(req.url === '/table' && req.method === 'POST') {
    const params = JSON.parse(content)
    getTable(params, res)
    return
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}


const server = http.createServer(function(req, res) {
  common.baseListener(req, res, listener)
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
