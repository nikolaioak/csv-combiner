#!/usr/bin/env node
const check = require('check-more-types');
const fs = require('fs')
const combine = require('./csv-combiner-src.js');
const path = require('path');

var inputFilenames = [];

if (process.argv.length < 4) {
  console.log('Usage: node csv-combiner.js <output.csv> <filename1.csv> <filename2.csv> <filenameN.csv> --OR-- node csv-combiner.js <output.csv> <folderpath>');
  process.exit(-1);
} else if (process.argv.length === 4) {
  // if three, check whether the third argument is a file or a folder
  if (process.argv[3].split('.').pop() === 'csv') {
    // it's a file, you can't combine just one
    console.log(`You'll need at least two files to combine stuff...`);
    process.exit(-1);
  } else if (process.argv[3].split('.').pop() !== 'csv') {
    fs.readdir(process.argv[3], function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      // listing all files using forEach
      if (files.length <= 1) {
        console.log(`You'll need at least two files to combine stuff...`);
        process.exit(-1);
      } else if (files.length > 1) {
        files.forEach(function (file) {
          if (file.split('.').pop() === 'csv') {
            // push files into file name array
            inputFilenames.push(path.join(path.resolve(process.argv[3]),file));
          } else {
            console.log(`You're working with .csv files, right?`);
            process.exit(-1);
          }
        });
        combine(process.argv[2], inputFilenames);
      }
    });
  }
} else if (process.argv.length > 4) {
  for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i].split('.').pop() === 'csv') {
      inputFilenames.push(process.argv[i])
    } else {
      console.log(`You're working with .csv files, right?`);
      process.exit(-1);
    }
  }
  combine(process.argv[2], inputFilenames);
}

check.fn(combine);