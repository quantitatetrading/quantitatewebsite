socket = io()

socket.on('error', (data) => {
  console.log(data)
  $('#message').html(data.error || data.msg)
  $('#message').removeClass('hidden')
});

function hide(){
  $('.error').addClass('hidden')
}