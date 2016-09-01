function InputForm() {
  
  /* *** Variables *** */
  
  // Create new Div
  this.formDiv = createDiv('');
  // Set size
  this.size = 400;
  // Set x and y to middle of the screen
  this.x = width / 2 - (this.size * 0.5);
  this.y = height / 2 - (this.size * 0.5);
  // Set saving mode to false
  this.savingMode = false;
  // Little X image for exiting menu
  this.exit = createImg('assets/exit.png');
  // Title of inputForm
  this.title = createElement('h1', 'Save Your SoundShape');
  // Artist Name label
  this.artistName = createP('Your Name:');
  // Artist Name input box
  this.nameInput = createInput('');
  // Track Name label
  this.trackName = createP('Track Name:');
  // Track Name input box
  this.trackInput = createInput('');
  // Color picker label
  this.colorPicker = createP('Pick a colour:');
  // Color picker input box (accessed from index.html)
  this.colorInput = select('.jscolor');
  // Button to submit form
  this.submitButton = createButton('Submit');
  // Saving label
  this.saving = createElement('h1', 'Saving...');
  // Saving percentage label
  this.savingPercentage = createP('0%');

  // Put all these DOM elements inside of formDiv
  this.formDiv.child(this.exit);
  this.formDiv.child(this.title);
  this.formDiv.child(this.artistName);
  this.formDiv.child(this.nameInput);
  this.formDiv.child(this.trackName);
  this.formDiv.child(this.trackInput);
  this.formDiv.child(this.colorPicker);
  this.formDiv.child(this.colorInput);
  this.formDiv.child(this.submitButton);
  this.formDiv.child(this.saving);
  this.formDiv.child(this.savingPercentage);

  // Hide all these form elements
  this.formDiv.hide();
  this.title.hide();
  this.artistName.hide();
  this.nameInput.hide();
  this.trackName.hide();
  this.trackInput.hide();
  this.colorPicker.hide();
  this.colorInput.hide();
  this.submitButton.hide();
  this.saving.hide();
  this.savingPercentage.hide();
  this.exit.hide();
  
  // If either of these elements clicked, respective callback function
  this.submitButton.mousePressed(saveForm);
  this.exit.mousePressed(exitForm);


  /* *** FUNCTIONS *** */
  
  // Run all main functions
  this.run = function() {
    this.display();
    this.updatePositions();
  }

  // Display function
  this.display = function() {

    // Show formDiv
    this.formDiv.show();
    // Set position, size and styling
    this.formDiv.position(this.x, this.y);
    this.formDiv.size(this.size, this.size);
    this.formDiv.style("font-family", "AvenirNextLTW01-Medium");
    this.formDiv.style("background-color", "#d9d9d9");
    
    // If not in saveMode
    if (!this.savingMode) {

      // Show these elements
      this.exit.show();
      this.title.show();
      this.artistName.show();
      this.nameInput.show();
      this.colorPicker.show();
      this.colorInput.show();
      this.submitButton.show();
      this.trackName.show();
      this.trackInput.show();
      
      // Set styling
      
      this.exit.style("position","absolute");
      this.exit.style("right","0px");
      this.exit.style("width","20px");
      this.exit.style("padding","5px");
      this.exit.style("padding-bottom","20px");
      this.exit.style("cursor","pointer");

      this.title.style("color", "black");
      this.title.style("text-align", "center");
      this.title.style("padding-top", "10px");

      this.artistName.style("color", "black");
      this.artistName.style("text-align", "left");
      this.artistName.style("margin-left", "10px");

      this.nameInput.style("text-align", "left");
      this.nameInput.style("margin-left", "10px");

      this.trackName.style("color", "black");
      this.trackName.style("text-align", "left");
      this.trackName.style("margin-left", "10px");

      this.trackInput.style("text-align", "left");
      this.trackInput.style("margin-left", "10px");

      this.colorPicker.style("color", "black");
      this.colorPicker.style("text-align", "left");
      this.colorPicker.style("margin-left", "10px");

      this.colorInput.style("text-align", "left");
      this.colorInput.style("margin-left", "10px");
      this.colorInput.style("font-family", "AvenirNextLTW01-Medium");

      this.submitButton.style("text-align", "left");
      this.submitButton.style("margin-left", "10px");
      this.submitButton.style("margin-top", "20px");
      this.submitButton.style("font-family", "AvenirNextLTW01-Medium");
      
    } // Else if we are in saveMode 
    else {
      // Hide all these elements 
      this.exit.hide();
      this.title.hide();
      this.artistName.hide();
      this.nameInput.hide();
      this.colorPicker.hide();
      this.colorInput.hide();
      this.submitButton.hide();
      this.trackName.hide();
      this.trackInput.hide();
    }
  }
  
  // Function to keep in the middle of the screen
  this.updatePositions = function() {
    this.x = width / 2 - (this.size * 0.5);
    this.y = height / 2 - (this.size * 0.5);
  }

  // Function to hide all elements
  this.hideAll = function() {
    this.formDiv.hide();
    this.exit.hide();
    this.title.hide();
    this.artistName.hide();
    this.nameInput.hide();
    this.colorPicker.hide();
    this.colorInput.hide();
    this.submitButton.hide();
    this.trackName.hide();
    this.trackInput.hide();
  }
  
  
  /* *** CALLBACKS *** */

  // BIG function for saving the input form, saves the track onto Server and the track meta-data into the JSON file
  function saveForm() {
    // Set saving mode to true 
    circleSequencer.inputForm.savingMode = true;

    // Show and style saving message 
    circleSequencer.inputForm.saving.show();
    circleSequencer.inputForm.saving.style("color", "black");
    circleSequencer.inputForm.saving.style("margin", "0");
    circleSequencer.inputForm.saving.style("position", "absolute");
    circleSequencer.inputForm.saving.style("text-align", "center");
    circleSequencer.inputForm.saving.style("top", "50%");
    circleSequencer.inputForm.saving.style("left", "50%");
    circleSequencer.inputForm.saving.style("margin-right", "-50%")
    circleSequencer.inputForm.saving.style("transform", "translate(-50%, -50%)");
    
    // Show and style saving percentage
    circleSequencer.inputForm.savingPercentage.show();
    circleSequencer.inputForm.savingPercentage.style("color", "black");
    circleSequencer.inputForm.savingPercentage.style("margin", "0");
    circleSequencer.inputForm.savingPercentage.style("position", "absolute");
    circleSequencer.inputForm.savingPercentage.style("text-align", "center");
    circleSequencer.inputForm.savingPercentage.style("top", "60%");
    circleSequencer.inputForm.savingPercentage.style("left", "50%");
    circleSequencer.inputForm.savingPercentage.style("margin-right", "-50%")
    circleSequencer.inputForm.savingPercentage.style("transform", "translate(-50%, -50%)");

    // Concatenate name and track entries with .wav
    var newTrackPathWithSpaces = circleSequencer.inputForm.nameInput.value() + '_' + circleSequencer.inputForm.trackInput.value() + ".wav";
    // Remove any spaces
    var newTrackPath = newTrackPathWithSpaces.replace(/ /g, "_");
    // Concatenate name and track entries
    var newName = circleSequencer.inputForm.nameInput.value() + ' - ' + circleSequencer.inputForm.trackInput.value();
    // Create hex value from color input
    var newColor = '#' + circleSequencer.inputForm.colorInput.value();
    // Assign new ID
    var newId = data.tracks.length + 1;
    // Assign new class id
    var classId = data.tracks.length;
    // New decription
    var newDescription = "This track is a remix of <span class=\"" + samplesId + "\">" + data.tracks[samplesId].name + "</span>, created with the In Concert 'Circle Sequencer'.";
    
    // Create new track object to add to JSON file
    var newSoundShape = {
      trackPath: "sounds/" + newTrackPath,
      trackSamplesPath: [],
      name: newName,
      description: newDescription,
      col: newColor,
      id: newId,
      childList: "",
      parents: [
        helpMenu.currentSoundShape.getId(),
        0
      ],
      children: [],
      family: [
        helpMenu.currentSoundShape.getId()
      ]
    };

    // Push new shape Id into child array of the SoundShape that was originally remixed 
    data.tracks[samplesId].children.push(newId); 
    // Push new shape Id into family array of the SoundShape that was originally remixed
    data.tracks[samplesId].family.push(newId); 
    // Add new track to childList of the SoundShape that was originally remixed 
    data.tracks[samplesId].childList = data.tracks[samplesId].childList + "<span class=\"" + classId + "\">" + newName + "</span><br>";   
    
    // Push the new soundShape into data object
    data.tracks.push(newSoundShape);

    // Create a Binary stream which sends the final .wav, along with an object containing some meta data regarding it
    stream = client.send(circleSequencer.finalWav, {
      name: newTrackPath,
      size: circleSequencer.finalWav.size
    });

    // Set reload to true
    reload = true;

    // Create new JSON object
    var newJson = {}; 

    // Weird work-around where you have to save data JSON object into fresh JSON object in order for it to save properly
    newJson.tracks = data.tracks; 

    // Send new Json file to Node server
    socket.emit('newJsonFile', newJson); 


    /* 
      This function was adapted from the Binary JS library example for file uploading
      (See https://github.com/binaryjs/binaryjs/tree/master/examples/fileupload).
    */

    // Variabe for how much of file has been uploaded
    var tx = 0;
    // Callback function called when data is streaming
    stream.on('data', function(data) {
      // Calculate how much of file uploaded as a percentage
      var progress = Math.round(tx += data.rx * 100);
      // Display this on inputForm screen
      circleSequencer.inputForm.savingPercentage.html(progress + "%");
      // If progress has reached 100%
      if (progress === 100) {
        // Reload entire programme 
        location.reload();
      }
    });
  }
  
  // Function to exit inputForm without saving
  function exitForm() {
    // Re-enable back button
    document.getElementById("backButton").disabled = false; 
    // set saveMode to false
    circleSequencer.saveMode = false;
  }
}