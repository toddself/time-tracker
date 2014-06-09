#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');

var moment = require('moment');
var colors = require('colors');
var minimist = require('minimist');
var argv = require('minimist')(process.argv.slice(2));

if(!process.stdout.isTTY){
  colors.setTheme({
    bold: 'stripColors',
    italic: 'stripColors',
    underline: 'stripColors',
    inverse: 'stripColors',
    yellow: 'stripColors',
    cyan: 'stripColors',
    white: 'stripColors',
    magenta: 'stripColors',
    green: 'stripColors',
    red: 'stripColors',
    grey: 'stripColors',
    blue: 'stripColors',
    rainbow: 'stripColors',
    zebra: 'stripColors',
    random: 'stripColors'
  });
}

var tt = require('../index');
var command = argv._[0];
var project = argv.p || argv.project || process.cwd();
var description = argv.m || argv.message;

function formatDuration(duration){
  var dur = [];
  var minutes = duration._data.minutes;
  if(duration._data.hours){
    dur.push(duration._data.hours+' h');
    minutes = duration._data.minutes = (duration._data.hours * 60);
  }
  dur.push(minutes+' m');
  return dur.join(', ');

}

function callback(err, results){
  var duration;
  if(err){
    console.log('Error:'.red, err.name, err.message);
    process.exit(1);
  }
  if(results === true){
    console.log(project, command === 'stop' ? 'stopped' : 'started');
    process.exit(0);
  }

  if(Array.isArray(results)){
    console.log('Report for', project);
    duration = 0;
    results.forEach(function(result){
      var date = moment(result).format('MMM DD, YYYY');
      var dur = moment.duration(moment(result.stop).diff(moment(result.start)));
      duration += dur._data.minutes;
      console.log(date, formatDuration(dur));
    });
    console.log('Total:', duration, 'minutes');

    process.exit(0);
  }

  if(results.active){
    duration = moment.duration(moment(new Date()).diff(moment(results.start)));
    console.log('Active:'.green, formatDuration(duration), results.description || '');
    process.exit(0);
  } else {
    duration = moment.duration(moment(results.stop).diff(moment(results.start)));
    console.log('Stopped. Last duration:'.green, formatDuration(duration), results.description || '');
  }
}

if(command === 'help' || typeof command === 'undefined' || argv.h || argv.help){
  var usage = path.join(__dirname, 'usage.txt');
  fs.createReadStream(usage).pipe(process.stdout);
}

if(typeof tt[command] === 'function'){
  if(command === 'start' && typeof description !== undefined){
    tt.start(project, description, callback);
  } else {
    tt[command].call(null, project, callback);
  }
}