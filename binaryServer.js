/*  
  The code is based on: 
  - File Upload example from Binary JS library (see https://github.com/binaryjs/binaryjs/tree/master/examples/fileupload)
  - Socket.io example from Socket.io library (see https://github.com/socketio/socket.io)
*/

// Get all the Node JS bits
var fs = require('fs');
var http = require('http');
var jsonfile = require('jsonfile');
var socket = require('socket.io');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

// Create http server
var server = http.createServer(app);

// Listen on port 9000
server.listen(9000);

// Create socket server
var io = socket(server);

// On connection, callback function 'newConnection'
io.sockets.on('connection', newConnection);

// Function called when new connection is made
function newConnection(socket) {
  // Log message to console to confirm connection
  console.log("New connection");
  // When a new json message received, callback function 'jsonMsg'
  socket.on('newJsonFile', jsonMsg);

  // Function for dealing with new json
  function jsonMsg(data) {
    
    // Create data path file name
    var fileName = 'public/data.json';
    
    // Save the file, log any errors
    jsonfile.writeFile(fileName, data, function(err) {
      console.error(err);
    })
  }
}



// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
  // Log message to console to confirm connection
  console.log('Connected!');
  // When client starts streaming data
  client.on('stream', function(stream, meta){
    // Log a confirmation message
    console.log('Server recieving client');
    // Create a file stream to public/sounds/ folder
    var file = fs.createWriteStream(__dirname + '/public/sounds/' + meta.name);
    // Save file
    stream.pipe(file);
    
    // Send progress back
    stream.on('data', function(data){
      stream.write({rx: data.length / meta.size});
    });
  });
});
// Log confirmation message to console  
console.log('HTTP and BinaryJS server started on port 9000');