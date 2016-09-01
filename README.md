# InConcert

In Concert is a web application for an experimental music collaboration project, inspired by open-source principles. Musicians and non-musicians openly share ideas and source materials. Creativity does not exist in a vacuum.

The code has mainly been written using p5.js, with some additional server-side code with Node.js. All client side code is divided into a number of classes with the main action happening in sketch.js.

Classes include:

- soundShape.js: A class which converts a audio track into a circular shape based on it's waveform.

- audioPlayer.js: A class for the global audioPlayer, drawn as two circles. The outer layer is a representation of the amplitude of the track at the current time. The inner layer is a playhead which can be clicked and dragged to skip through a track.

- connection.js: A class for creating the spring-like force that draws connected shapes together. These are turned on when a shape is playing.

- helpMenu.js: A class for the In Concert help menu, a useful tool for giving information about the shapes and the project. It also contains a hyperlink system for switching between shapes.

- circleSequencer.js: A class for the In Concert Circle Sequencer, a fun and easy tool for making a quick remix which can be saved into the main site as a new SoundShape.

- sampleShape.js: A class for the little samples used in the Circle Sequencer. A simpler version of the soundShape class.

- step.js: A class for the individual steps of the Circle Sequencer.

- inputForm.js: A class for the pop-up input form for saving a remix as a new SoundShape

Here is a reference list for code which I have adapted from other's work. I have also made it clear at these code sections that the code has been re-used.

- jscolor.js by Jan Odvarko

- 'Chapter 6 - Autonomous Agents' from the book The Nature Of Code by Daniel Shiffman.

- 'Chapter 6 - Dynamic Data Structures' from the book Generative Design by Hartmut Bohnacker, 
Benedikt GroB, Julia Laub and Claudius Lazzeroni (editor). 

- File Upload example from Binary JS library (see https://github.com/binaryjs/binaryjs/tree/master/examples/fileupload).

- Socket.io example from Socket.io library (see https://github.com/socketio/socket.io).
