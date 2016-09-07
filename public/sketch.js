/*
In Concert is a web application for an experimental music collaboration
project, inspired by open-source principles. Musicians and non-musicians 
openly share ideas and source materials. Creativity does not exist in a
vacuum.

The code has mainly been written using p5.js, with some additional
server-side code with Node.js. All client side code is divided into a number 
of classes with the main action happening in sketch.js (this current file).

Classes include:

- soundShape.js:      A class which converts a audio track into a circular shape based 
                      on it's waveform.
- audioPlayer.js:     A class for the global audioPlayer, drawn as two circles. The outer
                      layer is a representation of the amplitude of the track at the 
                      current time. The inner layer is a playhead which can be clicked 
                      and dragged to skip through a track.
- connection.js:      A class for creating the spring-like force that draws connected shapes
                      together. These are turned on when a shape is playing.
- helpMenu.js:        A class for the In Concert help menu, a useful tool for giving information
                      about the shapes and the project. It also contains a hyperlink system
                      for switching between shapes.
- circleSequencer.js: A class for the In Concert Circle Sequencer, a fun and easy tool for making
                      a quick remix which can be saved into the main site as a new SoundShape.
- sampleShape.js:     A class for the little samples used in the Circle Sequencer. A simpler version
                      of the soundShape class.
- step.js:            A class for the individual steps of the Circle Sequencer.
- inputForm.js:       A class for the pop-up input form for saving a remix as a new SoundShape

Here is a reference list for code which I have adapted from other's work. I 
have also made it clear at these code sections that the code has been re-used.

- jscolor.js by Jan Odvarko
- 'Chapter 6 - Autonomous Agents' from the book The Nature Of Code by Daniel Shiffman.
- 'Chapter 6 - Dynamic Data Structures' from the book Generative Design by Hartmut Bohnacker, 
               Benedikt GroB, Julia Laub and Claudius Lazzeroni (editor). 
- File Upload example from Binary JS library (see https://github.com/binaryjs/binaryjs/tree/master/examples/fileupload).
- Socket.io example from Socket.io library (see https://github.com/socketio/socket.io).

*/


/// Main variables ///

var soundShapes = []; // Array of SoundShapes objects
var tracks = []; // Array of tracks
var audioPlayer; // AudioPlayer object
var helpMenu; // Help Menu object
var myFont; // Global font style
var sizeConstant = 1100 // Variable to help determine size of shapes;
  //var soundShapeIndex
var randomShape; // Variable to hold random shape which is initially loaded into audioplayer
//var songLinkIndex;
var connections = []; // Array of Connection objects
var selectedSoundShape = null; // Variable used for holding a SoundShape which has been clicked on
var data; // Variable to hold JSON data
var counter = 0; // Counter variable to count up the number of SoundShapes
var everythingLoaded = false; // Variable to determine if all the SoundShapes have been loaded
var reload = false; // Boolean to control whether the page should be reloaded
var showLinks = false // Boolean to control whether all links should be showed

/// Circle Sequencer & Remix mode variables ///

var circleSequencer; // Circle Sequencer object
var samplesId; // Variable to contain reference to which track we want the samples from
var samples = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
]; // 2d Array which contains all the samples for the tracks which can be remixed
var playHeadCounter = 0; // Playhead counter variable for CircleSequencer
var sampleShapes = []; // Array of Sample Shape objects
var selectedSampleShape = null; // Variable used for holding a SampleShape which has been clicked on
var tempoSlider; // Slider DOM element to control tempo
var remixMode = false; // Variable to determine if the user is in remix mode


/// Communication with Server variables ///

var socket; // Socket connection
var client; // Binary connection
var stream; // Binary stream



/// Before setup() and draw()
function preload() {

  // Load JSON 
  data = loadJSON("data.json");

  // Load font
  myFont = loadFont("assets/AvenirNextLTW01-Medium.ttf");
}



function setup() {
  // Set canvas to window size which can be dynamically resized
  createCanvas(windowWidth, windowHeight);

  // Set font
  textFont(myFont);

  // Load in all the full audio tracks from the JSON file 
  for (var i = 0, j = data.tracks.length; i < j; i++) {
    // Once track is loaded, callback function newShape is used to create a new shape
    tracks[i] = loadSound(data.tracks[i].trackPath, newShape);
  }

  // For all the audio tracks
  for (var k = 0, l = data.tracks.length; k < l; k++) {
    // For all the samples of that audio track
    for (var i = 0, j = data.tracks[k].trackSamplesPath.length; i < j; i++) {
      // Load in all the samples tracks from the JSON file, into 2D Array
      samples[k][i] = loadSound(data.tracks[k].trackSamplesPath[i]);
    }
  }


  // Create new AudioPlayer object
  audioPlayer = new AudioPlayer();

  // Create new HelpMenu object
  helpMenu = new HelpMenu();

  // Create new CircleSequencer object
  circleSequencer = new CircleSequencer();

  // Create a Slider DOM element, with a range between 60bpm and 140bpm, starting at 90bpm and moving in increments of 1bpm
  tempoSlider = createSlider(60, 140, 90, 1);

  // Create a SocketIO connection on port 9000
  socket = io.connect('http://localhost:9000');

  // Create a BinaryJS connection on port 9000
  client = new BinaryClient('ws://localhost:9000');
  
  //setInterval(myDraw, 1000/30);
  window.requestAnimationFrame(myDraw);


}


function newShape() {

  var size = sizeConstant / data.tracks.length; // Scale size by diving sizeConstant by total number of tracks
  var x = width / 2 + random(-100, 100); // Start in middle width of screen plus a random offset
  var y = height / 2 + random(-100, 100); // Start in middle height of screen plus a random offset
  // Create a new soundShape with a position, size, track and more 
  soundShapes.push(new SoundShape(x, y, size, tracks[counter], audioPlayer.getSize(), helpMenu.size, data.tracks[counter].name, data.tracks[counter].id, data.tracks[counter].col, data.tracks[counter].description, data.tracks[counter].children, data.tracks[counter].parents, data.tracks[counter].family));

  // Increment the counter
  counter++;

  // If all the shapes have been loaded, call the finishSetup() function
  if (counter == data.tracks.length) {
    finishSetup();
  }
}

function finishSetup() {

  // Send all soundShapes to the audioPlayer
  audioPlayer.setSoundShapes(soundShapes);

  // Pick random soundShape be loaded in at the start
  randomShape = floor(random(soundShapes.length));
  // Update audioPlayer with the track from the random soundShape
  audioPlayer.updateCurrentTrack(soundShapes[randomShape].getTrack());
  // Initial color of audioPlayer waveform with random soundShape
  audioPlayer.setCurrentTrackColor(soundShapes[randomShape].getColor());


  // Call a shapeSetup method for all the soundShapes
  for (var i = 0, j = soundShapes.length; i < j; i++) {
    soundShapes[i].shapeSetup();
  }

  // Set samplesId to randomShape index
  samplesId = randomShape

  // Initialise connections
  // For every SoundShape
  for (var i = 0, j = soundShapes.length; i < j; i++) {
    // For every other SoundShape
    for (var k = 0, l = soundShapes.length; k < l; k++) {
      // For all family IDs of first SoundShape
      for (var f = 0, g = soundShapes[i].familyId.length; f < g; f++) {
        // If a family ID matches the ID of the other soundShape
        if (soundShapes[i].familyId[f] == soundShapes[k].getId()) {
          // Add a connection between those two soundShapes
          soundShapes[i].addConnection(new Connection(soundShapes[i], soundShapes[k], soundShapes[i].size));
        }
      }
    }
  }

  everythingLoaded = true; // Set everything loaded to be true
  
  console.log('finished');
}


// Called everytime user presses mouse
function mousePressed() {

  // If not in remixMode
  if (!remixMode) {
    // Check if you've clicked on a soundShape and play it with the audioPlayer
    audioPlayer.checkSoundShapes();
    // Use the audioPlayer manual controls with the mouse
    audioPlayer.newManualControls(mouseX, mouseY);

    // For all the soundShapes
    for (var i = 0, j = soundShapes.length; i < j; i++) {
      // If you click/hold on a shape 
      if (soundShapes[i].clickedOn(mouseX, mouseY)) {
        //set that shape to the selectedSoundShape variable (means you can move it with mouse)
        selectedSoundShape = soundShapes[i];
      }
    }
  }

  // If you are in remixMode
  if (remixMode) {

    // Use circleSequencer record controls
    circleSequencer.recordControl();

    // For all sampleShapes
    for (var i = 0, j = sampleShapes.length; i < j; i++) {
      // Calculate distance between shape center and mouse click co-ordinates
      var distance = dist(mouseX, mouseY, sampleShapes[i].posX, sampleShapes[i].posY);
      // If that distance is less than the sampleShapes size
      if (distance < sampleShapes[i].size) {
        //set that shape to the selectedSampleShape variable (means you can move it with mouse)
        selectedSampleShape = sampleShapes[i];
      }
    }
  }
}


// Call when a mouse press is released
function mouseReleased() {

  // If not in remixMode
  if (!remixMode) {
    // If it's not already, reset the selectedSoundShape to null
    if (selectedSoundShape !== null) selectedSoundShape = null;
  }

  // If in remixMode
  if (remixMode) {
    // If it's not already, reset the selectedSampleShape to null
    if (selectedSampleShape !== null) selectedSampleShape = null;
  }
}

// Function called when a pressed mouse is dragged
function mouseDragged() {
  // Use the audioPlayer manuel controls
  audioPlayer.newManualControls(mouseX, mouseY);
}


function myDraw() {

  // Set the background to black
  background(0);

  // If everything is loaded and we're not in remix mode
  if (everythingLoaded && !remixMode) {

    // For all the soundShapes 
    for (var i = 0, j = soundShapes.length; i < j; i++) {
      // If they are currently playing then display their connections
      soundShapes[i].drawConnections(soundShapes);
    }

    // For all the soundShapes
    for (var i = 0, j = soundShapes.length; i < j; i++) {
      // run soundShape main methods
      soundShapes[i].run(soundShapes);
      // check against the audioPlayer if they are currently playing
      if (audioPlayer.checkIfPlaying() && soundShapes[i].getTrack() == audioPlayer.getCurrentTrack()) {
        // Set that the soundShape is playing to true
        soundShapes[i].setIfPlaying(true);
        // Update helpMenu with that soundShape
        helpMenu.updateShape(soundShapes[i]);
        // Update that shape's connections
        soundShapes[i].updateConnections();
      } else {
        // Otherwise set that the soundShape is playing to false
        soundShapes[i].setIfPlaying(false);
      }
    }

    // Reset helpMenu to default message if no shapes playing
    if (!audioPlayer.checkIfPlaying()) helpMenu.noShapeSelected();

    // run the main methods of the audioPlayer
    audioPlayer.run();

    // run the main methods of the helpMenu
    helpMenu.run();

    // For all the connections
    for (var i = 0, j = connections.length; i < j; i++) {
      // Call update() method
      connections[i].update();
    }

    // If there is a selectedSoundShape
    if (selectedSoundShape != null) {
      // Move its position to mouse co-ordinates (ie: you can move shape with mouse)
      selectedSoundShape.position = createVector(mouseX, mouseY);
    }

    // Hide the tempoSlider from view
    tempoSlider.hide();

  } // Else if everything is loaded and we are in remixMode 
  else if (everythingLoaded && remixMode) {

    // Stop audioPlayer playing
    audioPlayer.stopCurrentTrack();

    // Keep running the help menu
    helpMenu.run();

    // Run the circleSequencer
    circleSequencer.run();

    // For all the sampleShapes
    for (var i = 0, j = sampleShapes.length; i < j; i++) {
      // display them
      sampleShapes[i].display();
    }

    // If there is a selectedSampleShape
    if (selectedSampleShape !== null) {
      // Move its position to mouse co-ordinates (ie: you can move shape with mouse)
      selectedSampleShape.posX = mouseX;
      selectedSampleShape.posY = mouseY;
    }
    
    // Show tempoSlider
    tempoSlider.show();
    // Set it's position
    tempoSlider.position(width / 2 + 400, height / 2 - 110);
    // Rotate it so it's vertial
    tempoSlider.style("rotate", 270);

    // White color fill
    fill(255);
    // White color outline 
    stroke(255);
    // Align the text to center
    textAlign(CENTER);
    // Label the tempoSlider
    text("Change Tempo", width / 2 + 465, height / 2 - 200);
    // Update the circleSequencer bpm with values from the tempoSlider
    circleSequencer.setTempo(tempoSlider.value());

    // Hide the remix button in the helpMenu
    helpMenu.remixButton.hide();

  } // If the shapes aren't loaded yet (initial state) 
  else {
    // Hide the tempoSlider
    tempoSlider.hide();
    // Hide the remix button in the helpMenu
    helpMenu.remixButton.hide();
    // White color fill
    fill(255);
    // Align text to center
    textAlign(CENTER);
    // Set text size
    textSize(20);
    // Variable to hold counter position as a percentage value (ie: how many tracks have been loaded in a percentage value)
    var percentage = floor(map(counter, 0, data.tracks.length, 0, 100));
    // Write Loading and give percentage of how much is loaded
    text('LOADING' + '\n' + percentage + '%', width / 2, height / 2);
  }
  
  
  window.requestAnimationFrame(myDraw);
}


// Dynamically update canvas based on window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// Function called when key pressed
function keyPressed() {
  // Exhibition safety measure, if something goes wrong, press escape to refresh page
  if(keyCode === ESCAPE) location.reload();
}