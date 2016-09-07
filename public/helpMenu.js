function HelpMenu() {

  /* *** Variables *** */

  // Create empty Div DOM Element
  this.helpDiv = createDiv('');
  // Set id
  this.helpDiv.id("helpDiv");
  // Set size
  this.size = 300;
  // Set x and y to bottom right corner of the screen
  this.x = width - this.size;
  this.y = height - this.size;

  // Current SoundShape
  this.currentSoundShape;

  // Has a shape been selected?
  this.shapeSelected = false;
  // Is the About The Project message showing?
  this.aboutOn = false;

  // Default message when no shape selected
  this.defaultMessage = createElement('h1', 'Click A SoundShape');
  // Set id
  this.defaultMessage.id("defaultMessage");
  // About Project button
  this.aboutButton = createButton('About The Project');
  // Assign it to button class so it highlights when you hover over it
  this.aboutButton.class("myButton");
  // Set id
  this.aboutButton.id("aboutButton");
  // Show all links button
  this.showLinksButton = createButton('Show All Connections');
  // Assign it to button class so it highlights when you hover over it
  this.showLinksButton.class("myButton");
  // Set id
  this.showLinksButton.id("showLinksButton")
  // About Project Title
  this.aboutTitle = createElement('h1', 'In Concert');
  // Set id
  this.aboutTitle.id('aboutTitle');
  // About Project description
  this.aboutDescription = createP('In Concert is a web application for an experimental music collaboration project, inspired by open-source principles. Musicians and non-musicians openly share ideas and source materials. Creativity does not exist in a vacuum.<br /><br />Listen to the SoundShapes by clicking on them and reveal their connections. Each SoundShape has an explanation of how it was made and why it is connected to other SoundShapes.<br /><br />Colour is used to represent different artists. You can click on a track\'s name in this Help Menu to skip to it<br /><br />Would you like to create your own remix?<br /><br />Some of the SoundShapes have a \'Click To Remix\' button which opens up the In Concert \'Circle Sequencer\', a fun and easy tool for making a quick remix. Record and save your remix to add your own SoundShape to In Concert.');
  // Set id
  this.aboutDescription.id("aboutDescription");
  // About Project back button
  this.aboutBackButton = createButton('Back');
  // Assign it to button class so it highlights when you hover over it
  this.aboutBackButton.class("myButton");
  // Set ID
  this.aboutBackButton.id("aboutBackButton");
  // Shape name
  this.shapeName = createElement('h1', '');
  // Set id
  this.shapeName.id("shapeName");
  // Short description of the shape
  this.shapeDescription = createP('');
  // Set id
  this.shapeDescription.id("shapeDescription");
  // Button to go into remix mode
  this.remixButton = createButton('Click To Remix');
  // Assign it to button class so it highlights when you hover over it
  this.remixButton.class("myButton");
  // Set id
  this.remixButton.id("remixButton");
  // Child list title
  this.childTitle = createElement('h2', 'Child List');
  // set id
  this.childTitle.id("childTitle");
  // List of children paragraph
  this.childList = createP('');
  // set id
  this.childList.id("childList");
  // Empty array for links to the tracks
  this.linksToTrack = [];
  // Link Index
  this.linkIndex;

  // Hide all these DOM elemts
  this.defaultMessage.hide();
  this.aboutButton.hide();
  this.aboutTitle.hide();
  this.aboutDescription.hide();
  this.aboutBackButton.hide();
  this.showLinksButton.hide();
  this.shapeName.hide();
  this.shapeDescription.hide();
  this.remixButton.hide();
  this.childTitle.hide();
  this.childList.hide();

  // Put all these DOM elements inside of helpDiv
  this.helpDiv.child(this.defaultMessage);
  this.helpDiv.child(this.aboutButton);
  this.helpDiv.child(this.aboutTitle);
  this.helpDiv.child(this.aboutDescription);
  this.helpDiv.child(this.aboutBackButton);
  this.helpDiv.child(this.showLinksButton);
  this.helpDiv.child(this.shapeName);
  this.helpDiv.child(this.shapeDescription);
  this.helpDiv.child(this.remixButton);
  this.helpDiv.child(this.childTitle);
  this.helpDiv.child(this.childList);


  /* *** FUNCTIONS *** */

  // Run main functions of helpMenu
  this.run = function() {
    this.display();
    this.updatePositions();
  }

  // Display the menu
  this.display = function() {

    // Set rectMode to CORNER
    rectMode(CORNER);

    // Display Help div
    this.helpDiv.show();

    // Set position, size and all styling for helpDiv
    this.helpDiv.position(this.x, this.y);
    this.helpDiv.size(this.size, this.size);
   

    // If no shape selected
    if (!this.shapeSelected && !this.aboutOn) {
      // Hide all these DOM elements
      this.aboutTitle.hide();
      this.aboutDescription.hide();
      this.aboutBackButton.hide();
      this.shapeName.hide();
      this.shapeDescription.hide();
      this.remixButton.hide();
      this.childTitle.hide();
      this.childList.hide();

      // Show default message / aboutButton / showLinksButton
      this.defaultMessage.show();
      
      this.aboutButton.show();
      // If aboutButton pressed, callback function showAboutProject
      this.aboutButton.mousePressed(function() {
        helpMenu.aboutOn = true;
      });

      this.showLinksButton.show();
      // If showLinksButton pressed, callback function showAllLinks
      this.showLinksButton.mousePressed(showAllLinks);

    } // Else if the user has clicked on About The Project and not a shape
    else if (this.aboutOn && !this.shapeSelected) {
      // Hide the default message, aboutButton and showLinkButton
      this.defaultMessage.hide();
      this.aboutButton.hide();
      this.showLinksButton.hide();
      // Show these elements
      this.aboutTitle.show();
      this.aboutDescription.show();
      this.aboutBackButton.show();
      
      // If aboutButton pressed, go back to default message
      this.aboutBackButton.mousePressed(function() {
        helpMenu.aboutOn = false;
      });
  
    } // Else, if a shape has been selected
    else {
      // Hide these elements
      this.defaultMessage.hide();
      this.aboutButton.hide();
      this.showLinksButton.hide();
      this.aboutTitle.hide();
      this.aboutDescription.hide();
      this.aboutBackButton.hide();
      // Show name and description
      this.shapeName.show();
      this.shapeDescription.show();
      // Calculate samplesID (It will be the current shape ID minus 1)
      samplesId = this.currentSoundShape.getId() - 1;

      // Only show remix button for tracks with samples 
      if (data.tracks[samplesId].trackSamplesPath.length > 1) {
        // Show remix button
        this.remixButton.show();
        // If remix button pressed, callback function remix
        this.remixButton.mousePressed(remix);
      } // Otherwise, if track doesn't have samples, don't show remix button 
      else this.remixButton.hide();

      // Show ChildList bits
      if (data.tracks[samplesId].childList != '') {
        this.childTitle.show();
        this.childList.show();
      } else {
        this.childTitle.hide();
        this.childList.hide();
      }


      // For all tracks 
      for (var i = 0, j = data.tracks.length; i < j; i++) {
        // Create an class string (eg: .1, .2, .3 etc)
        var index = '.' + i;
        // Select elements with this class and add them to the link to tracks array
        this.linksToTrack[i] = select(index);
        // If they have actually gotten hold of an element
        if (this.linksToTrack[i] !== null) {
          // Style the link with appropriate track color and change cursor to pointer when hovering
          this.linksToTrack[i].style('color', data.tracks[i].col);
          this.linksToTrack[i].style('cursor', 'pointer');
          // When clicked, callback function which changes to that track
          this.linksToTrack[i].mousePressed(changeTrack);
        }
      }

      // If in remixMode
      if (remixMode) {
        // Hide these elements
        this.remixButton.hide();
        this.childTitle.hide();
        this.childList.hide();

        // Update these with remix title and description
        this.shapeName.html('Create a Remix');
        this.shapeDescription.html('Drag the SampleShapes onto the white circles (make sure they lock in).<br /><br />To record your remix, press the <span id="red">red</span> button in the middle of the Circle Sequencer.<br /><br />Press the <span id="green">green</span> button to finish recording.');

        // New styling 
        this.shapeName.style("color", "white");

      } // Else, if not in remix mode 
      else {
        // Styling for shapeName
        this.shapeName.style("color", this.currentSoundShape.hexValue);
      }
    }
  }

  // Function which updates when a new shape is chosen
  this.updateShape = function(currentSoundShape) {
    // Update current shape
    this.currentSoundShape = currentSoundShape;
    // Update shape name
    this.shapeName.html(this.currentSoundShape.getTrackName());
    // Update shape description
    this.shapeDescription.html(this.currentSoundShape.getTrackDescription());
    // Update child list
    this.childList.html(data.tracks[samplesId].childList);
    // Set shapeSelected as true
    this.shapeSelected = true;
    // Reset aboutOn to false
    this.aboutOn = false;
  }

  // Function which sets shape selected to false
  this.noShapeSelected = function() {
    this.shapeSelected = false;
  }

  // Keeps helpMenu in bottom right corner at all times (even when window size is changed)
  this.updatePositions = function() {
    this.x = width - this.size;
    this.y = height - this.size;
  }


  /* *** CALLBACKS *** */

  // Function to change track
  function changeTrack() {
    // Convert class name to int
    var index = int(this.elt.className);
    // Use this index to change to new track
    audioPlayer.changeTrack(index);
  }

  // Function which prepares program for remix mode
  function remix() {

    // Work out ID of track are we remixing
    samplesId = helpMenu.currentSoundShape.getId() - 1;
    // Useful for counting in a nested for loop
    var counter = 0;
    // SampleShapes array must be empty first
    if (sampleShapes.length < 1) {
      // Loop through 10 samples as a 5 x 2 table
      for (var i = 0; i < 5; i++) {
        for (var k = 0; k < 2; k++) {
          // Add a new sampleShape to array
          sampleShapes.push(new SampleShape(100 * (k + 1), 100 * (i + 1) + 100, samples[samplesId][counter]));
          // Increment counter
          counter++;
        }
      }
      // Start circleSequencer (IMPORTANT that it is started here so the playhead matches up with the triggered samples) 
      circleSequencer.startSequencer();
    }
    // Set remixMode as true
    remixMode = true;
  }

  // Function to show / hide all links
  function showAllLinks() {
    // Inverse showLinks boolean to true or false 
    showLinks = !showLinks;

    // Change the message written on the button depending what mode you are in
    if (showLinks) helpMenu.showLinksButton.html('Hide All Connections');
    else helpMenu.showLinksButton.html('Show All Connections');

  }

}