var robot = require('robotjs')
var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('../public'))

console.log("listenting on 3000")
server.listen(3000);


io.on('connection', function (socket) {
  console.log('connected')

  var s = robot.getScreenSize()

  socket.on('touchMove', function (offset) {
    var mousePos = robot.getMousePos()
    // console.log(mousePos.x + offset.dx * s.width)
    robot.moveMouse(mousePos.x + offset.dx*2, mousePos.y + offset.dy*2)
  })

  socket.on('mouseClick', function () {
    // console.log('mouseClicked')
    robot.mouseClick('left', false) // doubleclick = false
  })

  socket.on('mouseClickRight', function () {
    // console.log('mouseClicked right')
    robot.mouseClick('right', false) // doubleclick = false
  })

  socket.on('mouseDown', function () {
    // console.log('mouseClicked')
    robot.mouseToggle("down");
  })

  socket.on('mouseUp', function () {
    // console.log('mouseClicked')
    robot.mouseToggle("up");
  })

  socket.on('scroll', function (direction) {
    console.log(direction)
    if (direction.up)
      robot.scrollMouse(1, "up");
    else {
      robot.scrollMouse(1, "down");
    }
  })

  socket.on('disconnect', function () {
    console.log('disconnected');
  });
});