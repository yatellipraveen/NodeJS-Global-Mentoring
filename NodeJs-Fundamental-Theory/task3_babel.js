//Task 1.3 Rewrite the code using babel
import { csv } from 'csvtojson';
import { createReadStream , createWriteStream } from 'fs';
import { pipeline } from 'stream';

const inputPath = 'task2/inputcsv/inputfile.csv';
const outputPath = 'task2/outputtxt/output_linebyline.txt';

const readstream = createReadStream(inputPath);
const writeStream = createWriteStream(outputPath);

pipeline(
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