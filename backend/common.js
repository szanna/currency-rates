const http = require('http');
const https = require('https');

async function httpGet(url) {
  return new Promise(function(resolve, reject){
      https.get(url, (res) => {
        var content = ''
        res.on('data', function(chunk){
          content += chunk
        })

        res.on('end', function(){
          resolve(content)
        })
      })
  })
}

async function genericListener (res){
  return new Promise(function(resolve, reject){
    var content = ''
    res.on('data', function(chunk){
      content += chunk
    })

    res.on('end', function(){
      resolve(content)
    })
  })
}

function baseListener(req, res, listener){
  var content = ''
  req.on('data', function(chunk){
    content += chunk
  })

  req.on('end', function(){
    listener(req, res, content)
  })
}

module.exports = {
  httpGet: httpGet,
  genericListener: genericListener,
  baseListener: baseListener
}
