function AudioPlayer() {

  /* *** Variables *** */

  this.currentTrack; // Currently loaded track
  this.fft = new p5.FFT(); // FFT analysis
  this.amplitude = new p5.Amplitude();
  this.ampBrightness = 0; // Variable which controls brightness of color fill based on amplitude 
  this.x = width / 2; // X position
  this.y = height / 2; // Y position
  this.size = 250; // Size of player
  this.waveform; // Waveform
  this.playHead; // Playhead
  this.newButtonX; // Button position on x-axis
  this.newButtonY; // Button position on y-axis
  this.playHeadPointsX = []; // Array to store x-axis points in playHead circle
  this.playHeadPointsY = []; // Array to store y-axis points in playHead circle
  this.circleRad = 20; // Radius of AudioPlayer
  this.currentTrackColor = null; // Waveform color for current track, initially set to nothing
  this.soundShapes; // soundShape array
  this.currentSoundShape; // current soundShape



  /* *** FUNCTIONS *** */

  // run all the main methods of audioPlayer
  this.run = function() {
    this.shapePlayerDisplay();
    this.update();
  }

  // Function to draw the audioPlayer
  this.shapePlayerDisplay = function() {

    // Set location to center of the screen
    this.newButtonX = width / 2;
    this.newButtonY = height / 2;

    // For all the soundShapes
    for (var i = 0, j = this.soundShapes.length; i < j; i++) {
      // If their track matches the current audioPlayer track
      if (this.currentTrack == this.soundShapes[i].getTrack()) {
        // update the currentSoundShape to that shape
        this.currentSoundShape = this.soundShapes[i];
      }
    }

    // Map the amplitude of the current track to use as a variable to control color brightness
    this.ampBrightness = map(this.amplitude.getLevel(), 0, 0.3, 0, 1);


    // Algorithm to convert hex value into RGB value
    // Get the hex value of the current soundShape, minus the #
    var hexMinusHash = this.currentSoundShape.hexValue.replace("#", "");
    // Get the Red hex values
    var rHex = hexMinusHash.charAt(0) + hexMinusHash.charAt(1);
    // Get the Green hex values
    var gHex = hexMinusHash.charAt(2) + hexMinusHash.charAt(3);
    // Get the Blue hex values
    var bHex = hexMinusHash.charAt(4) + hexMinusHash.charAt(5);
    // unhex these values to get RGB values in an array
    var rgbColor = unhex([rHex, gHex, bHex]);

    // Scale each RGB value depending on the amplitude of the track
    var r = rgbColor[0] * this.ampBrightness;
    var g = rgbColor[1] * this.ampBrightness;
    var b = rgbColor[2] * this.ampBrightness;

    // Set color mode
    colorMode(RGB);
    // Color variable with scaled RGB values
    var fftColor = color(r, g, b);

    // Outer lining is color of current SoundShape
    stroke(this.currentTrackColor);
    // Fill is the scaled RGB colors
    fill(fftColor);

    // Entering fresh matrix
    applyMatrix();
    // Translate to top left corner
    translate(this.newButtonX, this.newButtonY);

    // Get an array of waveform amplitude points
    this.waveform = this.fft.waveform(1024);

    // Array of point locations
    var pointLocationX = [];
    var pointLocationY = [];

    // Array of playHead point locations
    var playHeadPointLocationX = [];
    var playHeadPointLocationY = [];

    // Calculate angle Step by dividing 360 degress by waveform array length (This mean moving through the waveform array by an angle step will add up to 360)
    var angleStep = 360.0 / this.waveform.length;

    // StepSize is how far each point can extend or recede based on the waveform
    var stepSize = this.size * 0.1;

    // For all points in Waveform
    for (var i = 0, j = this.waveform.length; i < j; i++) {

      // Playhead radius is slightly smaller than main radius
      var playHeadRadius = this.size * 0.4;
      var soundRadius;

      // If the track is playing
      if (this.currentTrack.isPlaying()) {
        // Calculate sound radius based on the amplitude in the waveform array
        soundRadius = this.size * 0.5 + (stepSize * (this.waveform[i]));
      } // Otherwise reset the soundRadius to a static value (so it looks like a normal circle) 
      else {
        soundRadius = this.size * 0.5;
      }

      // Calucate circle points where the circumference represents the soundShape waveform
      var posX = sin(radians(angleStep * i)) * soundRadius;
      var posY = cos(radians(angleStep * i)) * soundRadius;

      // Add these points to point location array
      pointLocationX[i] = posX;
      pointLocationY[i] = posY;

      // Calucate circle points where the circumference represents the playHead circle
      var playHeadX = sin(radians(angleStep * i)) * playHeadRadius;
      var playHeadY = cos(radians(angleStep * i)) * playHeadRadius;

      // Add these points to playhead point location array
      playHeadPointLocationX[i] = playHeadX;
      playHeadPointLocationY[i] = playHeadY;

    }

    // Add these point arrays to playhead point location array
    this.playHeadPointsX = playHeadPointLocationX;
    this.playHeadPointsY = playHeadPointLocationY;

    // Outer audioPlayer circle
    // Draw closed shape with point location array
    beginShape();
    // First vertex is control point which must start at the end of the array
    curveVertex(pointLocationX[this.waveform.length - 1], pointLocationY[this.waveform.length - 1]);

    // For all the waveform array
    for (var i = 0, j = this.waveform.length; i < j; i++) {
      // Add a vertex at the point location
      curveVertex(pointLocationX[i], pointLocationY[i]);
    }

    // Close up vertex back at the beginning
    curveVertex(pointLocationX[0], pointLocationY[0]);
    // Last vertex is control point which must start at the 2nd position of the array
    curveVertex(pointLocationX[1], pointLocationY[1]);

    endShape();


    // Playhead circle
    // Black inner fill color
    fill(0);
    // Draw closed shape with point location array
    beginShape();
    // First vertex is control point which must start at the end of the array
    curveVertex(playHeadPointLocationX[this.waveform.length - 1], playHeadPointLocationY[this.waveform.length - 1]);
    // For all the waveform array
    for (var i = 0, j = this.waveform.length; i < j; i++) {
      // Add a vertex at the playhead point location
      curveVertex(playHeadPointLocationX[i], playHeadPointLocationY[i]);
    }
    // Close up vertex back at the beginning
    curveVertex(playHeadPointLocationX[0], playHeadPointLocationY[0]);
    // Last vertex is control point which must start at the 2nd position of the array
    curveVertex(playHeadPointLocationX[1], playHeadPointLocationY[1]);

    endShape();


    // Draw actual playhead
    // Find its position in points array based on the currentTime of the track 
    this.playHead = floor(map(this.currentTrack.currentTime(), 0, this.currentTrack.duration(), 0, this.waveform.length));
    // Fill with white
    fill(255);
    // Black outer edge
    stroke(0);
    // Small circle at the playHead position in the points array
    ellipse(playHeadPointLocationX[this.playHead], playHeadPointLocationY[this.playHead], 10, 10);

    // Close matrix
    resetMatrix();

    // Draw play and pause buttons
    // If the track is currently playing
    if (this.currentTrack.isPlaying()) {
      // Draw the pause symbol
      rectMode(CORNER);
      rect(this.newButtonX - 18, this.newButtonY - 20, 8, 40);
      rect(this.newButtonX + 10, this.newButtonY - 20, 8, 40);
    } // If track is not currenly playing 
    else if (!this.currentTrack.isPlaying()) {
      // draw the play symbol
      triangle(this.newButtonX - 14, this.newButtonY - 20, this.newButtonX + 26, this.newButtonY, this.newButtonX - 14, this.newButtonY + 20);
    }

  } // End of shapePlayerDisplay() function


  // Function to update next track
  this.update = function() {
    // If the current track has finished playing
    if (this.currentTrack.currentTime() > this.currentTrack.duration() - 0.5) {
      this.pickNextTrack(); // pick the next track
    }
  }

  // Pick next track method
  this.pickNextTrack = function() {
    // For all the soundShapes
    for (var i = 0, j = this.soundShapes.length; i < j; i++) {
      // If the current track in the audioPlayer is equal to your track
      if (this.currentTrack == this.soundShapes[i].getTrack()) {
        // Get the family ID array of that soundShape
        var familyArray = this.soundShapes[i].getFamilyId();
        // Pick a random value from the family ID
        var familyIndex = floor(random(familyArray.length));
        // Stop the current track
        this.stopCurrentTrack();
        // reset the current track with the track from the random Family member 
        this.currentTrack = this.soundShapes[familyArray[familyIndex] - 1].getTrack();
        // Set the color to be the new current track
        this.setCurrentTrackColor(this.soundShapes[familyArray[familyIndex] - 1].getColor());
        // Play the current track
        this.currentTrack.play();
        // Leave the loop
        break;
      }
    }
  }

  // Check which soundShape has been clicked on
  this.checkSoundShapes = function() {

    // Create empty array which is same length as soundShapes
    var selectedTrack = [this.soundShapes.length];

    // For all the soundShapes
    for (var i = 0, j = this.soundShapes.length; i < j; i++) {
      // Check if the user has clicked on you, and return your track or nothing
      selectedTrack[i] = this.soundShapes[i].checkTrack(mouseX, mouseY);
      // If you have return your track and it's not one already playing
      if (selectedTrack[i] !== null && selectedTrack[i] !== this.currentTrack) {
        this.changeTrack(i);
      }
    }
  }

  // Change the track, based on given index value
  this.changeTrack = function(index) {
    // Stop current track
    this.stopCurrentTrack();
    // Update current track with your track 
    this.updateCurrentTrack(this.soundShapes[index].getTrack());
    // Update waveform color with your color
    this.setCurrentTrackColor(this.soundShapes[index].getColor());
    // Play new track
    this.playCurrentTrack();
  }
  

  this.newManualControls = function(x, y) {

    var newButtonRad = this.size * 0.4; // Calculate button radius as smaller version of this.size
    var innerCircleRad = newButtonRad - 10; // Stops accidental skipping 
    var minimumDist = 100; // Starting off minimum distance required for click
    var nearestPoint; // Variable for nearest point

    // For all point in the playHead array
    for (var i = 0, j = this.playHeadPointsX.length; i < j; i++) {
      // Translate playHeadPoints to the center of the audioPlayer (Don't forget they were orginially calculated in an applyMatrix())
      this.playHeadPointsX[i] += this.newButtonX;
      this.playHeadPointsY[i] += this.newButtonY;
    }


    // If you click round the inner edge of the audio player
    if (x > this.newButtonX - newButtonRad && x < this.newButtonX + newButtonRad && y > this.newButtonY - newButtonRad && y < this.newButtonY + newButtonRad) {
      // Stops you accidentally skipping when clicking in the audioPlayer circle
      if (x > this.newButtonX + this.circleRad || x < this.newButtonX - this.circleRad || y > this.newButtonY + this.circleRad || y < this.newButtonY - this.circleRad) {
        // Calculate distance from mouse co-ordinates
        var distance = dist(x, y, this.newButtonX, this.newButtonY);
        // If you've clicked roughly somewhere on the playHead circle circumference
        if (distance > innerCircleRad) {
          // For all the playhead points
          for (var i = 0, j = this.playHeadPointsX.length; i < j; i++) {
            // Calculate the distance between them and mouse co-ordinates
            var pointDist = dist(x, y, this.playHeadPointsX[i], this.playHeadPointsY[i]);
            // If the distance is smaller than previous minimum distance
            if (minimumDist > pointDist) {
              // Update with new minimim distance
              minimumDist = pointDist;
              // Get index of that point 
              nearestPoint = i;
            }
          }
          // Map the position of the nearest point you've clicked on, to a position in the track
          var skip = map(nearestPoint, 0, this.playHeadPointsX.length - 1, 0, this.currentTrack.duration());
          // Jump to that point in the track
          this.currentTrack.jump(skip, this.currentTrack.duration() - skip);
        }
      }
    }

    // Calculate distance between circle and mouse click position
    var distance = dist(x, y, this.newButtonX, this.newButtonY);

    // If you click on button
    if (distance < this.circleRad) {
      // If track is currently playing
      if (this.currentTrack.isPlaying()) {
        this.currentTrack.pause(); // Pause it
      } // If track is not currently playing
      else if (!this.currentTrack.isPlaying()) {
        this.currentTrack.play(); // Play it
      }
    }
  }

  // Check if audioPlayer is currently playing something and return an answer
  this.checkIfPlaying = function() {
    if (this.currentTrack.isPlaying()) {
      return true;
    } else return false;
  }

  // play current track
  this.playCurrentTrack = function() {
    this.currentTrack.play();
  }

  // pause current track
  this.pauseCurrentTrack = function() {
    this.currentTrack.pause();
  }

  // Stop current track
  this.stopCurrentTrack = function() {
    this.currentTrack.stop();
  }

  // Update current track with a new track
  this.updateCurrentTrack = function(selectedTrack) {
    this.currentTrack = selectedTrack;
  }



  /* *** GETTERS / SETTERS *** */

  // Get height of current track
  this.getSize = function() {
    return this.size;
  }

  // Get current track
  this.getCurrentTrack = function() {
    return this.currentTrack;
  }

  // Set current track color
  this.setCurrentTrackColor = function(trackColor) {
    this.currentTrackColor = trackColor;
  }

  // set SoundShape array
  this.setSoundShapes = function(soundShapes) {
    this.soundShapes = soundShapes;
  }

}