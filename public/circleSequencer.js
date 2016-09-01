function CircleSequencer() {

  /* *** Variables *** */

  this.centerX = width * 0.5; // Center Width
  this.centerY = height * 0.5; // Center Height

  this.bpm = 90; // Initial BPM

  this.total = 16; // Total number of steps for each phrase
  this.angleStep = 360 / this.total; // So this.total can add up to a full 360 degrees
  this.crotchetRadius = 100; // Crotchet radius
  this.quaverRadius = 200; // Quaver radius
  this.semiQuaverRadius = 300; // Semi-quaver radius

  this.crotchetSteps = []; // Array for crotchet steps
  this.quaverSteps = []; // Array for quaver steps
  this.semiQuaverSteps = []; // Array for semi-quaver steps

  // Array for crotchet patter
  this.crotchetPattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // Array for quaver patter
  this.quaverPattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // Array for semiquaver patter
  this.semiQuaverPattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // New crotchet phrase, (name, callback to play sound, pattern)
  this.crotchetPhrase = new p5.Phrase('crotchet', playCrotchet, this.crotchetPattern);
  // New quaver phrase, (name, callback to play sound, pattern)
  this.quaverPhrase = new p5.Phrase('quaver', playQuaver, this.quaverPattern);
  // New semiquaver phrase, (name, callback to play sound, pattern)
  this.semiQuaverPhrase = new p5.Phrase('semiQuaver', playSemiQuaver, this.semiQuaverPattern);

  // New Part to contain the phrases
  this.circlePart = new p5.Part();
  // Add crotchet phrase
  this.circlePart.addPhrase(this.crotchetPhrase);
  // Add quaver phrase
  this.circlePart.addPhrase(this.quaverPhrase);
  // Add semiquaver phrase
  this.circlePart.addPhrase(this.semiQuaverPhrase);
  // Set BPM
  this.circlePart.setBPM(this.bpm);

  // New InputForm object
  this.inputForm = new InputForm();

  // Button DOM element to go back
  this.backButton = createButton('Back');
  // Set id of element 
  this.backButton.id("backButton");
  // Assign it to button class so it highlights when you hover over it
  this.backButton.class("myButton");
  // Hide it
  this.backButton.hide();

  // New recorder object
  this.recorder = new p5.SoundRecorder();
  // New soundfile to contain final recording
  this.finalSoundFile = new p5.SoundFile();
  // Variable to contain the .wav file of final recording
  this.finalWav;
  // Variable to determin whether Circle Sequencer is recording or not
  this.recordState = false;
  // Variable used to move through recording algorithm
  this.state = 0;
  // Button radius
  this.buttonRadius = 80;
  // Variable to determine if we are saving the sound
  this.saveMode = false;
  // For the total number of steps for each phrase
  for (var i = 0, j = this.total; i < j; i++) {
    // Add new Step objects to each array
    this.crotchetSteps.push(new Step());
    this.quaverSteps.push(new Step());
    this.semiQuaverSteps.push(new Step());
  }


  /* *** FUNCTIONS *** */

  // Function to run all the main functions
  this.run = function() {
    this.display();
    this.update();
    this.updatePositions();
  }

  // Starts the sequencer
  this.startSequencer = function() {
    this.circlePart.loop();
    this.circlePart.start();
  }

  // Update the circleSequencer
  this.update = function() {
    // For all the steps
    for (var i = 0, j = this.total; i < j; i++) {
      // Crotchets
      // 4 crotchets, update their pattern with id of step
      if (i % (this.total / 4) == 0) this.crotchetPattern[i] = this.crotchetSteps[i].getId();

      // If the playhead is on a crotchet step
      if (i == playHeadCounter) {
        // Highlight that step
        this.crotchetSteps[i].highlight(true);
      } // Else, don't highlight that step 
      else {
        this.crotchetSteps[i].highlight(false);
      }

      // Quavers
      // 8 quavers, update their pattern with id of step
      if (i % (this.total / 8) == 0) this.quaverPattern[i] = this.quaverSteps[i].getId();

      // If the playhead is on a quaver, highlight it. Otherwise don't highlight it
      if (i == playHeadCounter) this.quaverSteps[i].highlight(true);
      else this.quaverSteps[i].highlight(false);

      // Semi-Quavers
      // 16 quavers, update their pattern with id of step
      this.semiQuaverPattern[i] = this.semiQuaverSteps[i].getId();

      // If the playhead is on a semiquaver, highlight it. Otherwise don't highlight it
      if (i == playHeadCounter) this.semiQuaverSteps[i].highlight(true);
      else this.semiQuaverSteps[i].highlight(false);
    }

    // For every step of circlePart, callback to a function which increments the playHeadCounter
    this.circlePart.onStep(playHead);


    // When saving remix with inputForm, reset all the step ids (and therefore the patterns) to 0
    if (this.saveMode) {
      for (var i = 0, j = this.total; i < j; i++) {
        this.crotchetSteps[i].id = 0;
        this.quaverSteps[i].id = 0;
        this.semiQuaverSteps[i].id = 0;
      }
    }
  }


  // Function to draw circleSequencer
  this.display = function() {

    // Back button
    // Show it
    this.backButton.show();
    // Set rectMode to Center
    rectMode(CENTER);
    // Position it
    this.backButton.position(50, 50);
    // White letters
    this.backButton.style("color", "white");
    // 1px border
    this.backButton.style("border", "1px");
    // Rounded border edges
    this.backButton.style("border-radius", "2px");
    // Solid border
    this.backButton.style("border-style", "solid");
    // White border
    this.backButton.style("border-color", "white");
    // Change cursor to pointer when hovering 
    this.backButton.style("cursor", "pointer");
    // Bit of padding inside border
    this.backButton.style("padding", "10px 24px");
    // Set font size
    this.backButton.style("font-size", "16px");
    // Set font family
    this.backButton.style("font-family", "AvenirNextLTW01-Medium");
    // If button pressed, callback function to return to main screen
    this.backButton.mousePressed(goBackToMain); 

    // Open new matrix
    applyMatrix();
    // Translate to center
    translate(this.centerX, this.centerY);
    
    // Crotchet location point arrays
    var crotchetLocationX = [];
    var crotchetLocationY = [];

    // Quaver location point arrays
    var quaverLocationX = [];
    var quaverLocationY = [];

    // Semiquaver location point arrays
    var semiQuaverLocationX = [];
    var semiQuaverLocationY = [];

    // For all the steps
    for (var i = 0, j = this.total; i < j; i++) {

      // Calculate circular point position based on angleStep and radius
      
      crotchetLocationX[i] = sin(radians(this.angleStep * i)) * this.crotchetRadius;
      crotchetLocationY[i] = cos(radians(this.angleStep * i)) * this.crotchetRadius;

      quaverLocationX[i] = sin(radians(this.angleStep * i)) * this.quaverRadius;
      quaverLocationY[i] = cos(radians(this.angleStep * i)) * this.quaverRadius;

      semiQuaverLocationX[i] = sin(radians(this.angleStep * i)) * this.semiQuaverRadius;
      semiQuaverLocationY[i] = cos(radians(this.angleStep * i)) * this.semiQuaverRadius;

    }


    // For all the steps
    for (var i = 0, j = this.total; i < j; i++) {
      // Run 4 crotchets at the corresponding positions 
      if (i % (this.total / 4) == 0) {
        this.crotchetSteps[i].run(crotchetLocationX[i], crotchetLocationY[i]);
      }
    
      // Run 8 quavers at the corresponding positions
      if (i % (this.total / 8) == 0) {
        this.quaverSteps[i].run(quaverLocationX[i], quaverLocationY[i]);
      }
      
      // Run 16 semiquavers at the corresponding positions
      this.semiQuaverSteps[i].run(semiQuaverLocationX[i], semiQuaverLocationY[i]);
    }

    // Leave matrix
    resetMatrix();


    // Record Button 
    // No outline
    noStroke();
    // Grey filling
    fill(200);
    // Draw a circle in the middle
    ellipse(this.centerX, this.centerY, this.buttonRadius, this.buttonRadius);

    // If we are recording, draw the green stop recording square
    if (this.recordState) {
      rectMode(CENTER);
      fill(0, 255, 0);
      rect(this.centerX, this.centerY, 30, 30);
    } // If we are not recording, draw the red start recording circle 
    else {
      fill(255, 0, 0);
      noStroke();
      ellipse(this.centerX, this.centerY, 30, 30);
    }


    // If we are in saveMode
    if (this.saveMode) {
      // Run the input form
      this.inputForm.run();
      // Disable the back button
      document.getElementById("backButton").disabled = true; // disable backButton
      // Normal cursor when hovering over back button
      this.backButton.style("cursor", "default");
    } // Otherwise, hide all inputForm DOM elements
    else {
      this.inputForm.hideAll();
    }

  }

  // Function for record controls (only run when mouse pressed)
  this.recordControl = function() {
    // If we are not in save mode
    if (!this.saveMode) {
      // Calculate distance from button to mouse co-ordinates
      var distance = dist(mouseX, mouseY, this.centerX, this.centerY);
      // If we've clicked on button     
      if (distance < this.buttonRadius) {
        // Increment state
        this.state++;
        // Change recordState to true or false
        this.recordState = !this.recordState;
      }

      // If state equals 1
      if (this.state === 1) {
        // Record remix into empty SoundFile variable
        this.recorder.record(this.finalSoundFile);
      } // Else, if state equals 2
      else if (this.state === 2) {
        // Stop the recording
        this.recorder.stop();
        // Concert the p5 Soundfile to a .wav
        this.finalWav = getWav(this.finalSoundFile);
        // Set save mode to true
        this.saveMode = true;
        // Reset finalSoundFile to a new empty SoundFile
        this.finalSoundFile = new p5.SoundFile();
        // Reset state to 0
        this.state = 0;
      }
    }
  }

  // Function to reset circleSequencer's position to middle of screen at all times
  this.updatePositions = function() {
    this.centerX = width * 0.5;
    this.centerY = height * 0.5;
  }


  /* *** CALLBACKS *** */

  function playHead() {
    // Increaments playheaad
    playHeadCounter++;
    // Reset to 0 once it reaches 16
    if (playHeadCounter == 16) playHeadCounter = 0;
  }

  // Plays Crotchet steps
  function playCrotchet(time, playbackRate) {
    // If sample loaded into step (playbackRate basically equal id of sample + 1)
    if (playbackRate > 0 && remixMode) {
      // Play correct sample
      samples[samplesId][playbackRate - 1].rate(1);
      samples[samplesId][playbackRate - 1].play(time);
    }
  }

  // Plays Quaver steps
  function playQuaver(time, playbackRate) {
    // If sample loaded into step (playbackRate basically equal id of sample + 1)
    if (playbackRate > 0 && remixMode) {
      // Play correct sample
      samples[samplesId][playbackRate - 1].rate(1);
      samples[samplesId][playbackRate - 1].play(time);
    }
  }
  
  // Plays Semiquaver steps
  function playSemiQuaver(time, playbackRate) {
    // If sample loaded into step (playbackRate basically equal id of sample + 1)
    if (playbackRate > 0 && remixMode) {
      // Play correct sample
      samples[samplesId][playbackRate - 1].rate(1);
      samples[samplesId][playbackRate - 1].play(time);
    }
  }

  // Function to return to main screen
  function goBackToMain() {
    // Hide back button
    circleSequencer.backButton.hide();
    // Hide tempo slider
    tempoSlider.hide();

    // For all sampleShapes
    for (var i = 0, j = sampleShapes.length; i < j; i++) {
      // return them to original positon
      sampleShapes[i].returnToOgPosition();
    }

    // Clear sampleShape array by making length = 0
    sampleShapes.length = 0;
    // Display remix button
    helpMenu.remixButton.show();

    // Reset drum machine
    for (var i = 0, j = this.total; i < j; i++) {
      circleSequencer.crotchetSteps[i].id = 0;
      circleSequencer.quaverSteps[i].id = 0;
      circleSequencer.semiQuaverSteps[i].id = 0;
    }

    // Start all the soundShapes in the middle again
    for (var i = 0, j = soundShapes.length; i < j; i++) {
      soundShapes[i].returnToMiddle();
    }

    // Set remix mode to false
    remixMode = false;
  }


  /* *** GETTERS / SETTERS *** */

  // Set the BPM of the circleSequencer with a new BPM
  this.setTempo = function(value) {
    this.bpm = value;
    this.circlePart.setBPM(this.bpm);
  }

}