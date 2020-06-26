// --------get stuff from server-----------//
function getCurrNamesFromServer(){
  function response (data){
    currencyListDropdown(data)
  }

  var get = $.get( "http://192.168.2.6:3001/currencynames", response)
}

function getMainRatesFromServer(){
  function response (data){
    showMainCurrienciesRates(data)
    showDiffRates(data)
  }

  var get = $.get( "http://192.168.2.6:3001/maincurrencies", response)
}

// --------send stuff to server-----------//
function sendSelectedDataToServer(reqData){

  function newTable (resData){
    showTable(resData)
  }
   $.post( "http://192.168.2.6:3001/table", JSON.stringify(reqData), newTable)
}


// --------main functions-----------//

function showAlert(id){
  $(id).show();
  setTimeout(function(){
    $(id).hide();
  }, 5000);
}

function readAboutPage(){
  $("#about").click(function(){
    $('#aboutPage').modal(show)
  })
}

function currencyListDropdown(data){
  var parent = $('#currency')
  for(var i=0;i<data.length;i++){
    var option = $('<option data-subtext="'+ data[i].label + '">' + data[i].code + '</option>');
    parent.append(option)
  }
  parent.selectpicker('refresh')
}

function showMainCurrienciesRates(data){
  $('#usd #mid').text(data.usd.mid)
  $('#usd #bid').text(data.usd.bid)
  $('#usd #ask').text(data.usd.ask)

  $('#eur #mid').text(data.eur.mid)
  $('#eur #bid').text(data.eur.bid)
  $('#eur #ask').text(data.eur.ask)

  $('#gbp #mid').text(data.gbp.mid)
  $('#gbp #bid').text(data.gbp.bid)
  $('#gbp #ask').text(data.gbp.ask)

  $('#chf #mid').text(data.chf.mid)
  $('#chf #bid').text(data.chf.bid)
  $('#chf #ask').text(data.chf.ask)
}

function showDiffRates(data){
  const arrowUp = '<i class="fas fa-arrow-up"></i>'
  const arrowDown = '<i class="fas fa-arrow-down"></i>'

  function showArrow(data, curr){
    if(data[curr].diffMid<0){
      $('#'+ curr +' #arrow-mid').html(arrowDown)
    } else if(data[curr].diffMid>0) {
      $('#' + curr + ' #arrow-mid').html(arrowUp)
    }

    if(data[curr].diffBid<0){
      $('#'+ curr +' #arrow-bid').html(arrowDown)
    } else if(data[curr].diffBid>0) {
      $('#'+ curr +' #arrow-bid').html(arrowUp)
    }

    if(data[curr].diffAsk<0){
      $('#'+ curr +' #arrow-ask').html(arrowDown)
    } else if(data[curr].diffAsk>0) {
      $('#'+ curr +' #arrow-ask').html(arrowUp)
    }
  }

  showArrow(data, 'usd')
  showArrow(data, 'eur')
  showArrow(data, 'gbp')
  showArrow(data, 'chf')
}

function setDateFormat(date){
  if (date.match(/^((19|20)\d{2})\-(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])$/)){
    return date
  }
  else {
    showAlert('#wrongDateFormat')
  }
}


function clickButton(){

  deleteTable()

  let curr = $('#currency').val()
  let rateType = $('#rate-type').val()
  let date = $('#data').val()

  setDateFormat(date)

  const inputs = {
    curr: curr.toLowerCase(),
    rateType: rateType,
    date: date
  }
  sendSelectedDataToServer(inputs)
}

function keyPress(){

  $('#data').keypress(function(e){
    if(e.which === 13){
      clickButton()
    }
  })
}

function showTable(data){
  if (data.rows && data.rows.err === 'requested object not found'){
    showAlert('#wrongCurrency')
  }
  else if (data.err === 'date is invalid'){
    showAlert('#Holiday')
  }

  else{
    createHeader(data)
    createTableBody(data.rows, data.headers)
  }
}

function createHeader(data){

  $('#rateTable table').append($('<thead></thead>'))
  $('#rateTable thead').append ($('<tr></tr>'))
  let headers =$('#rateTable thead tr')
  for (var i=0;i<data.headers.length;i++){
    var th = $('<th>' + data.headers[i].name + '</th>')
    headers.append(th)
  }
}

 function createTableBody(rows, headers, ){
   $('#rateTable table').append('<tbody></tbody>')
   for (var i=0;i<rows.length;i++){
     let bodyTable = $('#rateTable tbody')
     const tr = createRow(rows[i], headers)
     bodyTable.append(tr)
   }
 }

function createRow(row, headers){
  let tr = $('<tr></tr>')
  headers.forEach(function(col){
    const name = col.name
    const key = col.key
    if(key === 'curr'){
      tr.append(createTableCol(col.curr.toUpperCase()))
    } else {
      tr.append(createTableCol(row[key]))
    }
  })
  return tr
}

function createTableCol(value){
  return $('<td></td>').text(value)
}

function deleteTable(){
  $('#rateTable table').html('')
}



function start(){
  getCurrNamesFromServer()
  getMainRatesFromServer()
  keyPress()
}


$( document ).ready(start);
