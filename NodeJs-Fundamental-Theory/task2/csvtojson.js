const csv=require('csvtojson');
const fs = require('fs');

const inputPath = 'task2/inputcsv/inputfile.csv';
const outputPath = 'task2/outputtxt/output.txt';


const readstream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(outputPath);

csv()
.fromStream(readstream)
.then((jsonObj)=>{
    const jsonResult = JSON.stringify(jsonObj)
    writeStream.write(jsonResult);
});

readstream.on('error', (error) =>{
    console.log("Input File Not Found")
})
