'use strict';

var test = require('tap').test;
var tt = require('../');


function cleanup(db, tt, t){
  tt.clean(db, function(err, success){
    t.ok(!err, 'No error thrown');
    t.ok(success, 'Deleted');
    t.end();
  });
}

test('Starting and stopping functionality', function(t){
  var prefix = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
  tt.start(prefix+'test', function(err, status){
    t.ok(!err, 'No error thrown');
    t.ok(status, 'start returned true');
    tt.start(prefix+'test', function(err){
      t.equal('UnstoppedError', err.name, 'Error returned trying to start a started project');
      tt.stop(prefix+'test', function(err, status){
        t.ok(!err, 'No error thrown');
        t.ok(status, 'stop returned true');
        cleanup(prefix+'test', tt, t);
      });
    });
  });
});


test('Statuses', function(t){
  var prefix = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
  tt.start(prefix+'test', function(err, status){
    t.ok(!err, 'no error');
    t.ok(status, 'started');
    tt.status(prefix+'test', function(err, status){
      t.ok(!err, 'no error');
      t.ok(status.active, 'currently active');
      t.ok(!isNaN(new Date(status.start)), 'start time is a date');
      t.equal(typeof status.stop, 'undefined', 'stop is undefined');
      tt.stop(prefix+'test', function(err, status){
        t.ok(!err, 'no error');
        t.ok(status, 'successfully stopped');
        tt.status(prefix+'test', function(err, status){
          t.ok(!err, 'no error');
          t.ok(!status.active, 'no longer active');
          t.ok(!isNaN(new Date(status.start)), 'start time is a date');
          t.ok(!isNaN(new Date(status.stop)), 'stop time is a date');
          cleanup(prefix+'test', tt, t);
        });
      });
    });
  });
});

test('Report', function(t){
  var prefix = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
  tt.start(prefix+'test', function(err, status){
    t.ok(!err, 'no error');
    t.ok(status, 'started');
    tt.report(prefix+'test', function(err, report){
      t.ok(!err, 'no error');
      t.ok(Array.isArray(report), 'got an array');
      report.forEach(function(r){
        t.ok(!isNaN(new Date(r.start)), 'start time is a date');
        t.equal(typeof r.stop, 'undefined', 'stop is undefined');
      });
      tt.stop(prefix+'test', function(err, status){
        t.ok(!err, 'no error');
        t.ok(status, 'stopped');
        tt.report(prefix+'test', function(err, report){
          t.ok(!err, 'no error');
          t.ok(Array.isArray(report), 'got an array');
          report.forEach(function(r){
            t.ok(!isNaN(new Date(r.start)), 'start time is a date');
            t.ok(!isNaN(new Date(r.stop)), 'stop time is a date');
          });
          cleanup(prefix+'test', tt, t);
        });
      });
    });
  });
});