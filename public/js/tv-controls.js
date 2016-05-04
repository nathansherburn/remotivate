function changeChannel(channel) {
  console.log(channel)
  socket.emit('change channel', {channel: channel})
}