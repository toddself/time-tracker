'use strict';

var path = require('path');
var level = require('level');

var dbPath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
var dbName = '.time-tracker.leveldb';
var db = level(path.join(dbPath, dbName), {valueEncoding: 'json'});

var TTErr = require('./time-tracker-error');

/**
 * Start tracking time on a project
 * @method  start
 * @async
 * @param   {string} project The project name. This needs to be unique and will be used as the key in the leveldb
 * @param   {Function} cb Error or success
 * @returns {object} undefined
 */
exports.start = function(project, cb){
  db.get(project, function(err, data){
    if(err && err.type !== 'NotFoundError'){
      return cb(err);
    }
    data = data || [];

    var unstopped = data.filter(function(d){
      return d && !d.stop;
    });

    if(unstopped.length > 0){
      return cb(new TTErr('UnstoppedError', 'Unstopped times exist for this project', JSON.stringify(unstopped)));
    }

    var current = {start: (new Date()), stop: undefined};
    data.push(current);
    db.put(project, data, function(err){
      if(err){
        return cb(err);
      }
      cb(null, true);
    });
  });
};

/**
 * Get the current tracking status on a project
 * @method  status
 * @async
 * @param   {string} project project name
 * @param   {Function} cb Error or tracking object (.active, .stop, .start)
 * @returns {object} undefined
 */
exports.status = function(project, cb){
  db.get(project, function(err, data){
    var recent;

    if(err && err.type !== 'NotFoundError'){
      return cb(err);
    }

    data = data || [];
    if(data.length > 0){
      recent = data.pop();
      if(typeof recent.stop === 'undefined'){
        recent.active = true;
      } else {
        recent.active = false;
      }
      return cb(null, recent);
    } else {
      return cb(new TTErr('InvalidCommandError', 'No tracking exists for this project'));
    }
  });
};

/**
 * Stop tracking time for a current project
 * @method  stop
 * @async
 * @param   {string} project project name
 * @param   {Function} cb Error or true
 * @returns {object} undefined
 */
exports.stop = function(project, cb){
  db.get(project, function(err, data){
    if(err){
      return cb(err);
    }
    data = data || [];

    if(data.length === 0){
      return cb(new TTErr('InvalidCommandError', 'You cannot stop something you have not started'));
    }

    var current = data.pop();
    if(typeof current.stop !== 'undefined'){
      return cb(new TTErr('InvalidCommandError', 'Already stopped'));
    }
    current.stop = new Date();
    data.push(current);
    db.put(project, data, function(err){
      if(err){
        return cb(err);
      }
      cb(null, true);
    });
  });
};

/**
 * Get a report for a current project
 * @method  report
 * @async
 * @param   {string} project project name
 * @param   {Function} cb error or array of tracker objects
 * @returns {object} undefined
 */
exports.report = function(project, cb){
  db.get(project, function(err, data){
    if(err && err.type !== 'NotFoundError'){
      return cb(err);
    }

    data = data || [];

    if(data.length > 0){
      return cb(null, data);
    }

    return cb(new TTErr('InvalidCommandError', 'No tracking for this project'));

  });
};

/**
 * Clean out a project. Like delete. Like go bye-bye entirely.
 * @method  clean
 * @async
 * @param   {string} project project name
 * @param   {Function} cb Error or true
 * @returns {object} undefined
 */
exports.clean = function(project, cb){
  db.del(project, function(err){
    if(err){
      return cb(err);
    }
    cb(null, true);
  });
};