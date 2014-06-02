# Time Tracker
A simple utility to track the amount of time you've spent working on a project.

## Installation:

`npm install --global time-tracker`

## Usage

```
(~/src/project) > tt start
/Users/todd/src/project started
(~/src/project) > tt status
Active: 0 m
[several minutes later]
(~/src/project) > tt stop
/Users/todd/src/project stopped
(~/src/project) > tt status
Stopped. Last duration: 7 m
(~/src/project) > tt report
Report for /Users/todd/src/project
Jun 3, 2014: 7 m
Total: 7 minutes
```

If you like giving your stuff different names

```
(~/src/project) > tt start my-new-project
my-new-project started
(~/src/project) > tt stop my-new-project
my-new-project stopped
(~/src/project) > tt status my-new-project
Stopped. Last duration: 0 m
(~/src/project) > tt report my-new-project
Report for my-new-project
Jun 3, 2014: 0 m
Total: 0 minutes
```

## Data
The data is stored in a LevelDB file in your home directory called `.time-tracker.leveldb`. The key for each project is the directory name in which you invoked `tt`, unless you passed in the second optional parameter

## License
Time Tracker is ©2014 Todd Kennedy. Available for use under the [MIT License](LICENSE).
