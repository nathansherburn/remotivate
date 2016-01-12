var robot = require('robotjs')
var io = require('socket.io')(8080);

io.on('connection', function (socket) {
  console.log('connected')

  var s = robot.getScreenSize()

  socket.on('moveMouse', function (offset) {
    // console.log('moveMouse to ' + offset.x, offset.y)
    var mousePos = robot.getMousePos()
    console.log(mousePos.x + offset.dx * s.width)
    robot.moveMouse(mousePos.x + offset.dx * s.width, mousePos.y + offset.dy * s.height)
  })

  socket.on('mouseClick', function () {
    console.log('mouseClicked')
    robot.mouseClick('left', false) // double = false
  })

  socket.on('disconnect', function () {
    console.log('disconnected');
  });
});

// robot.moveMouse(0, 0) // x:1920 y:1080

console.log('listening...')