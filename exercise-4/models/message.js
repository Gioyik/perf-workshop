// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tasks =[];

// Define our Message schema
var MessageSchema   = new mongoose.Schema({
  text: String,
  title: String
});

MessageSchema.pre('save', function(callback) {
  var message = this;
  for(var i =0; i < 1000; i++) {
    tasks.push(message.title);
    tasks.push(message.text);
  } 
  callback();
});


// Export the Mongoose model
module.exports = mongoose.model('Message', MessageSchema);

