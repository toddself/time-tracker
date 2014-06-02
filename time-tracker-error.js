'use strict';

var TimeTrackerError = function(type){
  var message = Array.prototype.slice.call(arguments).slice(1).join(' ');
  var err = new Error(message);
  err.name = type;
  this.name = type;
  this.message = err.message;
  if(err.stack){
    this.stack = err.stack;
  }
};

TimeTrackerError.prototype =  new Error();
TimeTrackerError.prototype.name = 'TimeTrackerError';
TimeTrackerError.prototype.toString = function(){
  return this.name+': '+this.message;
};

module.exports = TimeTrackerError;