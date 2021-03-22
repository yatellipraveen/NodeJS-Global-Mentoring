const csv = require('csvtojson');
const fs = require('fs');
const readline = require("readline");
const { pipeline } = require('stream');
const zlib = require('zlib');

const inputPath = 'task2/inputcsv/inputfile.csv';
const outputPath = 'task2/outputtxt/output_linebyline.txt';

const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity
});
const readstream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(outputPath);

// csv()
// .fromStream(readstream)
// .then((jsonObj)=>{
//     const jsonResult = JSON.stringify(jsonObj)
//     writeStream.write(jsonResult);
// });
pipeline(
    readstream,
    async function* (source) {
        source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
        for await (const chunk of source) {
          yield chunk.toUpperCase();
        }
      },
    writeStream,
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      } else {
        console.log('Pipeline succeeded.');
      }
    }
  );

// rl.on('line', (fileData) =>{
//     console.log(fileData);
//     csv()
//     .fromString(fileData)
//     .then((jsonObj)=>{
//         console.log(jsonObj)
//         const jsonResult = JSON.stringify(jsonObj)
//         writeStream.write(jsonResult);
//     });
// });

// rl.on('error', (error) =>{
//     console.log("Input File Not Found")
// })


// const csv=require('csvtojson');
// const fs = require('fs');
// const readline = require('readline');

// const inputPath = 'task2/inputcsv/inputfile.csv';
// const outputPath = 'task2/outputtxt/output.txt';

// const rl = readline.createInterface({
// //   input: fs.createReadStream('task2/inputcsv/nodejs-hw1-ex1.xlsx'),
// input: fs.createReadStream(inputPath),

// crlfDelay: Infinity
// });
// const readstream = fs.createReadStream(inputPath);
// const writeStream = fs.createWriteStream('task2/outputtxt/output.txt');

// csv()
// .fromFile(inputPath)
// .then((jsonObj)=>{
//     console.log(jsonObj);
//     const result = JSON.stringify(jsonObj)
//     writeStream.write(result);
// });
// readstream.on('data', (chunk)=>{
//     csv().fromString(chunk).then((data)=>{
//         writeStream.write(data);
//     });
// })

// rl.on('line', (line) => {
//     csv().fromStream(line).then((result) =>{
//         writeStream.write(result);
//     })
 
// });