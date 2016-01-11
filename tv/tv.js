var robot = require('robotjs')
var io = require('socket.io')(8080);

io.on('connection', function (socket) {
  console.log('connected')

  var screenSize = robot.getScreenSize()

  socket.on('moveMouse', function (position) {
    console.log('moveMouse to ' + position.x*screenSize.width, position.y*screenSize.height)
    // robot.moveMouseSmooth(position.x, position.y)
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