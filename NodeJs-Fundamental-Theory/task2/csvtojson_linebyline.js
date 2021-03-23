//Task 1.2 Do not load entire csv file into ram
const csv = require('csvtojson');
const fs = require('fs');
const pipeline  = require('stream');

const inputPath = 'task2/inputcsv/inputfile.csv';
const outputPath = 'task2/outputtxt/output_linebyline.txt';

const readstream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(outputPath);

pipeline.pipeline(
    readstream,
    csv(),
    writeStream,
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      } else {
        console.log('Pipeline succeeded.');
      }
    }
);

readstream.on('error', (error) =>{
  console.log("Input File Not Found")
})