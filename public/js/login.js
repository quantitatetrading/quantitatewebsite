socket = io()

socket.on('error', (data) => {
  console.log(data)
  $('#' + data.type).html(data.error || data.msg)
  $('#' + data.type).removeClass('hidden')
});

function hide(){
  $('.error').addClass('hidden')
}
socket = io()

socket.on('error', (data) => {
  console.log(data)
  $('#' + data.type).html(data.error || data.msg)
  $('#' + data.type).removeClass('hidden')
});

function hide(){
  $('.error').addClass('hidden')
}
