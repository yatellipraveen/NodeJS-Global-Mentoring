const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin
});

rl.on('line', (input) => {
    let input_reverse = input.split("").reverse().join("");
    console.log(input_reverse);
});

