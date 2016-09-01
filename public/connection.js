/*  
  This class is based on code taken used from Chapter 6 - Dynamic Data Structures
  from the book Generative Design by Hartmut Bohnacker, Benedikt GroB,
  Julia Laub and Claudius Lazzeroni (editor).
*/

function Connection(fromSoundShape, toSoundShape, connectionLength) {

  /* *** Variables *** */

  // Set fromShape
  this.fromSoundShape = fromSoundShape;
  // Set toShape
  this.toSoundShape = toSoundShape;

  // ConnectionLength based on size of shape + extra random factor
  this.connectionLength = connectionLength + random(50);
  // How stiff connection is
  this.stiffness = 0.2;
  // Dampens the force overtime
  this.damping = 0.9;
  
  
  /* *** FUNCTIONS *** */

  // Update function
  this.update = function() {

    // Calculate the distance between two shapes as a vector
    var diff = p5.Vector.sub(this.toSoundShape.position, this.fromSoundShape.position);
    // Normalise vector
    diff.normalize();
    // Scale it by length
    diff.mult(this.connectionLength);
    // Calculate target vector
    var target = p5.Vector.add(this.fromSoundShape.position, diff);

    // Calculate force vector
    var force = p5.Vector.sub(target, this.toSoundShape.position);
    // Split force in half
    force.mult(0.5);
    // Apply stiffness
    force.mult(this.stiffness);
    // Apply dampening 
    force.mult(1 - this.damping);

    // Apply force to toSoundShape
    this.toSoundShape.applyForce(force);
    // Apply inverse force to fromSoundShape
    this.fromSoundShape.applyForce(p5.Vector.mult(force, -1));
  }

  // Function to update connection length
  this.updateLength = function(newLength) {
    this.connectionLength = newLength;
  }

}