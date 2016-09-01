function Step() {
  
  /* *** Variables *** */
  
  // X position
  this.posX;
  // Y position
  this.posY;
  // Id 
  this.id = 0;
  // Color
  this.c = color(255);
  // On? boolean
  this.on = false;
  // Size
  this.size = 20;
  // Index for selected sampleShape
  this.shapeIndex = null;

  
  /* ***FUNCTIONS*** */
  
  // Run the main functions
  this.run = function(x, y) {
    this.display(x, y);
    this.update();
  }
  
  // Update function
  this.update = function() {
    // For all the sampleShapes
    for (var i = 0, j = sampleShapes.length; i < j; i++) {
      // Calculate distance between sampleShape and this step
      var distance = dist(sampleShapes[i].posX - width/2, sampleShapes[i].posY - height/2, this.posX, this.posY);
      // If the distance is less than 20
      if(distance < 20) {
        // Lock in the sampleShape onto my posistion (Don't forgot to add width/2 or height/2 to translate to right spot)
        sampleShapes[i].posX = this.posX + width/2;
        sampleShapes[i].posY = this.posY + height/2;
        // Set 'on' state of sampleShape to true
        sampleShapes[i].on = true;
        // Set ID
        this.id = i + 1;
        // Set shapeIndex
        this.shapeIndex = i;
        // Leave for loop
        break;
      } // Otherwise
      else {
        // Set 'on' state of sampleShape to false 
        sampleShapes[i].on = false;
        // Set ID to 0
        this.id = 0;
        // Set shapeIndex to null
        this.shapeIndex = null;
      }  
    }  
  }
  
  // Display function
  this.display = function(x, y) {
    
    // Set x and y position
    this.posX = x;
    this.posY = y;
    
    // Fill with step color with no border
    fill(this.c);
    noStroke();
    // draw circle 
    ellipse(this.posX, this.posY, this.size, this.size);
  }
  
  
  // Highlight function
  this.highlight = function(playHeadHover) {
    // If playHeadHover is true
    if(playHeadHover) {
      // Change color to red
      this.c = color(255,0,0);
      // If shapeIndex doesn't equal null, turn the highlight of sampleShape at that index to true
      if(this.shapeIndex != null) sampleShapes[this.shapeIndex].highlight(true);
    } // Otherwise 
    else {
      // Set color to white
      this.c = color(255);
      // If shapeIndex doesn't equal null, turn the highlight of sampleShape at that index to false
      if(this.shapeIndex != null) sampleShapes[this.shapeIndex].highlight(false);
    }  
  }
  
  /* *** GETTERS / SETTERS *** */
  
  // Get ID
  this.getId = function() {
    return this.id;
  }
 
  
}