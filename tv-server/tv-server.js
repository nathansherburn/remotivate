var robot = require('robotjs')
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var request = require('request')
var xml2json = require('ee-xml-to-json');
var sys = require('sys')
var exec = require('child_process').exec;


// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// }
// app.use(allowCrossDomain)

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

  socket.on('change channel', function (data) {

    request.get('http://localhost:8080/requests/status.xml?command=pl_play&id='+data.channel,
      function (error, response, body) {
      if (!error && response.statusCode == 200) {
        xml2json(body, function (e,j) {console.log(j)})
      }
    })
    .auth('', 'asdf', false)
  })

  socket.on('start app', function (data) {

    exec("wmctrl -l", function(err, stdout, stderr){
      if(stdout.search(data.appName) === -1) {
        // console.log("not open, opening now", stdout)
        exec(data.appName.toLowerCase(), function(err, stdout, stderr){
          exec("wmctrl -a " + data.appName, function(){
            exec('wmctrl -r ' + data.appName + ' -b toggle,fullscreen',
              function(err, stdout, stderr){
                console.log('asdffullscreen')
            })
          })
        })
      } else {
        exec("wmctrl -a " + data.appName, function(){})
      }
    })

    function activate () {
      exec("wmctrl -a " + data.appName, function(){})
    }

    function fullscreen () {
        // if (data.appName === 'vlc') {
        //   request.get('http://localhost:8080/requests/status.xml?command=fullscreen',
        //     function (error, response, body) {callback() }).auth('', 'asdf', false)
        // } else if (true) {
          exec('wmctrl -r ' + data.appName.toLowerCase() + ' -b toggle,fullscreen',
            function(err, stdout, stderr){ })
        // } 
    }
  })

  socket.on('disconnect', function () {
    console.log('disconnected');
  });
});