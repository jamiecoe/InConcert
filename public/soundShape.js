/*  
  The code used for movement and seperation is based on code taken used from: 
  - 'Chapter 6 - Autonomous Agents' from the book The Nature Of Code by Daniel Shiffman
  - 'Chapter 6 - Dynamic Data Structures' from the book Generative Design by Hartmut Bohnacker, 
    Benedikt GroB, Julia Laub and Claudius Lazzeroni (editor).
*/


function SoundShape(x, y, size, track, audioPlayerSize, helpMenuSize, trackName, id, myColor, relationDescription, childId, parentId, familyId) {
  
  /* *** Variables *** */
  
  this.position = createVector(x, y); // Position vector
  this.velocity = createVector(0, 0); // Velocity vector
  this.acceleration = createVector(0, 0); // Acceleration vector
  this.trackName = trackName; // Track name
  this.maxForce = 0.1; // Max turning force
  this.maxSpeed = 10; // Max speed
  this.track = track; // Audio track

  this.audioPlayerSize = audioPlayerSize; // Audioplayer size
  this.helpMenuSize = helpMenuSize; // HelpMenu size
  this.shapeColor = 0; // Neutral shape color
  this.hexValue = myColor; // Hex value
  this.shapeHighlightedColor = color(myColor); // Shape color when playing
  this.stepSize; // Step size
  
  this.noiseStep = []; // Noise step array
  this.noisePositionX = random(1000); // Random starting point for noiseFeed 
  this.noisePositionY = random(1000); // Random starting point for noiseFeed
  this.spinFactor = random(-0.01, 0.01); // Random spin factor
  this.spin = 0; // Spin 
  this.isPlaying = false; // Is track playing?
  this.id = id; // soundSquare ID 
  this.parentId = parentId; // Array to contain parent ID
  this.childId = childId; // Array to contain child ID
  this.familyId = familyId; // Array to contain family ID
  this.relationDescription = relationDescription; // Track Description
  this.damping = 0.1; // Damping factor when calculating force
  this.strength = 5; // Strength factor when calculating force 
  this.ramp = 1.0; // Ramp factor when calculating force
  this.connections = []; // Connections array


  /* *** FUNCTIONS *** */

  // Extra bit of setup which can only be done after tracks have been loaded
  this.shapeSetup = function() {
    this.size = size + (this.track.duration() / 40); // Size (Diameter) + factor based on track length
    this.waveForm = this.track.getPeaks(128); // Waveform of track
    this.angleStep = 360.0 / this.waveForm.length; // Angle step size
    // Add random values to noiseStep array
    for (var i = 0; i < this.waveForm.length; i++) {
      this.noiseStep[i] = random(1000);
    }
  }
  
  // Run the main functions of soundShape
  this.run = function(others) {
    this.display(this.position.x, this.position.y);
    this.update();
    this.separate(others);
    this.wallBoundaries();
    this.audioPlayerBoundaries();
    this.helpMenuBoundaries();
  }
  
  // Function to add new connections 
  this.addConnection = function(newConnection) {
    this.connections.push(newConnection);
  }

  // Function to update all connections
  this.updateConnections = function() {
    for (var i = 0, j = this.connections.length; i < j; i++) {
      this.connections[i].update();
    }
  }

  // Function to repel shapes from helpMenu   
  this.helpMenuBoundaries = function() {
    // If the shape goes into the helpMenu area
    if(this.position.x + this.size > width - this.helpMenuSize && this.position.y + this.size > height - this.helpMenuSize) {
      // Adapted from Generative Design
      // Calculate distance from shape and center of helpMenu
      var distance = dist(this.position.x, this.position.y, width - (this.helpMenuSize * 0.5), height - (this.helpMenuSize * 0.5));
      // Calculate force
      var s = pow(distance / (width - this.size), 1 / this.ramp);
      var f = s * 9 * (this.strength * 2) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, createVector(width - (this.helpMenuSize * 0.5), height - (this.helpMenuSize * 0.5)));
      df.mult(f);
      // Apply force
      this.applyForce(df);
    }
  }
  
  
  // Function to return shape to a starting position
  this.returnToMiddle = function() {
    var x = width / 2 + random(-100, 100); // Random x starting position
    var y = height / 2 + random(-100, 100); // Random x starting position
    this.position = createVector(x, y); // Position vector
  }


  // Seperate function
  this.separate = function(others) {
    // Check against all the other soundShape
    for (var i = 0, j = others.length; i < j; i++) {
      // If it's itself, skip it
      if (others[i] === this) {
        continue;
      }
      // Apply seperation against the other shape
      this.applySeparate(others[i]);
    }
  }

  // Function to apply separation
  this.applySeparate = function(shape) {
    // desired separation is shape size multiplied by 4
    var desiredSeparation = this.size * 4;
    // Calculate distance between me and other shape
    var d = p5.Vector.dist(this.position, shape.position);
    // If distance greater than 0 and is less than desired separation
    if (d > 0 && d < desiredSeparation) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var s = pow(d / desiredSeparation, 1 / this.ramp);
      var f = s * 9 * this.strength * (1 / (s + 1) + ((s - 3) / 4)) / d;
      var df = p5.Vector.sub(this.position, shape.position);
      df.mult(f);
      this.applyForce(df);
    }
  }

  // Apply a force to velocity
  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  // Check for wall boundaries
  this.wallBoundaries = function() {
    // Desired space beween me and walls
    var space = this.size; 
    // If shape near left or right wall, create vector is opposite direction
    if (this.position.x < space) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var distance = dist(this.position.x, this.position.y, width / 2, height / 2);
      var s = pow(distance / space, 1 / this.ramp);
      var f = s * 5 * (this.strength * -1) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, createVector(width / 2, height / 2));
      df.mult(f);
      this.applyForce(df);
    } else if (this.position.x > width - space) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var distance = dist(this.position.x, this.position.y, width / 2, height / 2);
      var s = pow(distance / (width - space), 1 / this.ramp);
      var f = s * 5 * (this.strength * -1) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, createVector(width / 2, height / 2));
      df.mult(f);
      this.applyForce(df);
    }

    // If shape near top (ie: where the audioPlayer is) or bottom wall, create vector is opposite direction
    if (this.position.y < space) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var distance = dist(this.position.x, this.position.y, width / 2, height / 2);
      var s = pow(distance / space, 1 / this.ramp);
      var f = s * 5 * (this.strength * -1) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, createVector(width / 2, height / 2));
      df.mult(f);
      this.applyForce(df);
    } else if (this.position.y > height - space) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var distance = dist(this.position.x, this.position.y, width / 2, height / 2);
      var s = pow(distance / space, 1 / this.ramp);
      var f = s * 5 * (this.strength * -1) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, createVector(width / 2, height / 2));
      df.mult(f);
      this.applyForce(df);
    }
  }

  // Function to repel shapes from audioPlayer   
  this.audioPlayerBoundaries = function() {
    // Calculate distance between shape and middle of screen
    var distance = dist(this.position.x, this.position.y, width / 2, height / 2);
    // Vector for audioPlayer position
    var audioPlayerPos = createVector(width / 2, height / 2);
    // Desired separation is audioPlayer size plus 50
    var desiredSeparation = this.audioPlayerSize + 50;

    // If distance is greater than 0 and less than desired separation
    if (distance > 0 && distance < desiredSeparation) {
      // Adapted from Generative Design
      // Calculate and apply force in opposite direction
      var s = pow(distance / desiredSeparation, 1 / this.ramp);
      var f = s * 9 * (this.strength * 2) * (1 / (s + 1) + ((s - 3) / 4)) / distance;
      var df = p5.Vector.sub(this.position, audioPlayerPos);
      df.mult(f);
      this.applyForce(df);
    }

  }


  // Update soundShape
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    // Add velocity to position
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
    // Dampen velocity each cycle 
    this.velocity.mult(1 - this.damping);

    // Noise based wobble factor (between -0.5 and 0.5)
    var noiseX = noise(this.noisePositionX) - 0.5;
    var noiseY = noise(this.noisePositionY) - 0.5;
    this.velocity.add(createVector(noiseX, noiseY));
    
    // Increment noise seeds 
    this.noisePositionX += 0.01;
    this.noisePositionY += 0.01;

    // If the track is playing
    if (this.isPlaying) {
      // Set fill color to shapeHighlighted color
      this.shapeColor = color(this.shapeHighlightedColor);
    } // Else, if shape is not playing 
    else {
      // Set fill color to black
      this.shapeColor = 0;
    }
  }

  // Function to update size
  this.updateSize = function(newSize) {
    this.size = newSize;
  }


  // Function to draw connections 
  this.drawConnections = function(others) {
    // For all the soundShapes
    for (var i = 0, j = others.length; i < j; i++) {
      // For both parents
      for (var p = 0; p < this.familyId.length; p++) {
        //If the parent ID matches with another soundShape
        if (this.familyId[p] == others[i].getId()) {
          //If that soundShape is currently playing and showLinks mode is off
          if (this.checkIfPlaying() && !showLinks) {
            // Draw line connection using color of other soundShape 
            stroke(others[i].getColor());
            noFill();
            line(this.position.x, this.position.y, others[i].position.x, others[i].position.y);
          } // Else, if showLinks mode is on
          else if(showLinks) {
            // Draw all line connection using color of this soundShape 
            stroke(this.getColor());
            noFill();
            line(this.position.x, this.position.y, others[i].position.x, others[i].position.y);
          }
        }
      }
    }
  }
  

  // Display function to draw shape
  this.display = function(xPos, yPos) {

    // Fill with black or highlighted color with white border
    stroke(255);
    fill(this.shapeColor);

    // Open new matrix
    applyMatrix();

    // Translate to soundShape position
    translate(xPos, yPos);
    // Make shape spin by spinFactor 
    this.spin += this.spinFactor;
    rotate(this.spin);

    // Array of point locations
    var pointLocationX = [];
    var pointLocationY = [];

    // StepSize is how far each point can extend or recede based on the waveform
    this.stepSize = this.size / 3;

    // For all points in Waveform
    for (var i = 0, j = this.waveForm.length; i < j; i++) {
      // Calculate sound radius based on the amplitude in the waveform array
      // Also add a noise factor 
      var soundRadius = this.size / 2 + (this.stepSize * (this.waveForm[i]) + (noise(this.noiseStep[i]) * 5));

      // Calucate circle points where the circumfrence represents the soundShape waveform
      var posX = sin(radians(this.angleStep * i)) * soundRadius;
      var posY = cos(radians(this.angleStep * i)) * soundRadius;

      // Add these points to point location array
      pointLocationX[i] = posX;
      pointLocationY[i] = posY;

      // Advance the noise step
      this.noiseStep[i] += 0.05;
    }

    // Draw closed shape with point location array
    beginShape();
    // First vertex is control point which must start at the end of the array
    curveVertex(pointLocationX[this.waveForm.length - 1], pointLocationY[this.waveForm.length - 1]);
    // For all the waveform array
    for (var i = 0, j = this.waveForm.length; i < j; i++) {
      // Add a vertex at the point location
      curveVertex(pointLocationX[i], pointLocationY[i]);
    }
    // Close up vertex back at the beginning
    curveVertex(pointLocationX[0], pointLocationY[0]);
    // Last vertex is control point which must start at the 2nd position of the array
    curveVertex(pointLocationX[1], pointLocationY[1]);
    // Close shape
    endShape();
    // Close matrix
    resetMatrix();

  }

  // Check if user has clicked on me
  this.checkTrack = function(x, y) {
    // mouse position
    var mousePosition = createVector(x, y);
    // distance between me and mouse position
    var distance = p5.Vector.dist(this.position, mousePosition);
    // if this distance is less than my size
    if (distance < this.size) {
      return this.track; // return my track
      this.isPlaying = true; // I am playing
    } else {
      return null; // return nothing
      this.isPlaying = false; // I'm not playing
    }
  }


  // Another 'user clicked on' check method
  this.clickedOn = function(x, y) {
    // mouse position
    var mousePosition = createVector(x, y);
    // distance between me and mouse position
    var distance = p5.Vector.dist(this.position, mousePosition);
    // if this distance is less than my size
    if (distance < this.size && distance != 0) {
      // Return true
      return true;
    } // Else return false 
    else return false;
  }


  /* *** GETTERS / SETTERS *** */

  // Check if I'm playing method
  this.checkIfPlaying = function() {
    return this.isPlaying;
  }

  // Set if I'm playing
  this.setIfPlaying = function(state) {
    this.isPlaying = state;
  }

  // Get track name
  this.getTrackName = function() {
    return this.trackName;
  }

  // Get track description
  this.getTrackDescription = function() {
    return this.relationDescription;
  }
  
  // Get my track
  this.getTrack = function() {
    return this.track;
  }
  
  // Set parentId
  this.setParentId = function(parentId1, parentId2) {
    var parentIdTotal = [parentId1, parentId2];
    this.parentId = parentIdTotal;
  }

  // Set familyId
  this.setFamilyId = function(family) {
    this.familyId = family;
  }

  // Set childId
  this.setChildId = function(children) {
    this.childId = children;
  }
  
  // Get color 
  this.getColor = function() {
    return this.shapeHighlightedColor;
  }

  // Get parentId
  this.getParentId = function() {
    return this.parentId;
  }

  // Get familyId
  this.getFamilyId = function() {
    return this.familyId;
  }

  // Get childId
  this.getChildId = function() {
    return this.childId;
  }

  // Get Id
  this.getId = function() {
    return this.id;
  }

}