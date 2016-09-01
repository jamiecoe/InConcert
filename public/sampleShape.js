function SampleShape(posX, posY, sample) {
  
  /* *** Variables *** */
  
  // X position
  this.posX = posX; 
  // Y position
  this.posY = posY;
  // Original X position (save for later)
  this.originalPosX = posX;
  // Original Y position (save for later)
  this.originalPosY = posY;
  // p5 SoundFile
  this.sample = sample;
  // Size
  this.size = 50;
  // On boolean
  this.on = false;
  // Color variable based on which SoundShape is being sampled
  this.c = color(helpMenu.currentSoundShape.hexValue);
  // Waveform of sample
  this.waveForm = this.sample.getPeaks(128);
  // StepSize is how far each point can extend or recede based on the waveform
  this.stepSize = this.size / 3;
  // Calculate angle Step by dividing 360 degress by waveform array length (This mean moving through the waveform array by an angle step will add up to 360)
  this.angleStep = 360.0 / this.waveForm.length;
  // Noise step array
  this.noiseStep = [];
  // Random spin factor
  this.spinFactor = random(-0.01,0.01);
  // Spin variable
  this.spin = 0;
  // Add random values to noiseStep array
  for (var i = 0; i < this.waveForm.length; i++) {
    this.noiseStep[i] = random(1000);
  }
  
  
  /* ***FUNCTIONS*** */
  
  // Run the main functions of sampleShape
  this.run = function() {
    this.display();
  }
  
  // Function to draw sampleShape
  this.display = function() {
    
    // White border and fill with shape color 
    stroke(255);
    fill(this.c);
    
    // Entering fresh matrix
    applyMatrix();
    
    // Translate to shape position
    translate(this.posX, this.posY);
    // Make shape spin by spinFactor 
    this.spin += this.spinFactor;
    rotate(this.spin);
    
    // Array of point locations
    var pointLocationX = [];
    var pointLocationY = [];
    
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
    // Close Matrix
    resetMatrix();
    
    // When saving remix with inputForm, return all sampleShapes to their original position
    if(circleSequencer.saveMode) {
      this.returnToOgPosition();
    }
    
  }
  
  // Function to return sampleShape to its original position
  this.returnToOgPosition = function() {
    this.posX = this.originalPosX;
    this.posY = this.originalPosY;
  }
  
  // Function to highlight shape when playHead is on it
  this.highlight = function(playHeadHover) {
    // If playHeadHover is true, highlight in red
    if(playHeadHover) {
      this.c = color(255,0,0);
    } // Else, keep it the original color  
    else this.c = color(helpMenu.currentSoundShape.hexValue);
  }
  
}