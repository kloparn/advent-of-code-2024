import fs from "fs";

const data = fs.readFileSync("data", "utf8").match(/mul\(\d{1,3},\d{1,3}\)/g);

console.log("part 1", data.reduce((acc, mulValues) => {
  const [a, b] = mulValues.match(/\d{1,3}/g);

  return acc + Number(a) * Number(b);
}, 0));

const data2 = fs.readFileSync("data", "utf8").match(/do\(\)|don't\(\)|mul\(\d{1,3},\d{1,3}\)/g);

let mulEnabled = true;
console.log("part 2", data2.reduce((acc, mulValues) => {
  if (mulValues === "do()") mulEnabled = true;
  else if (mulValues === "don't()") mulEnabled = false;
  else if (mulEnabled) {
    const [a, b] = mulValues.match(/\d{1,3}/g);

    return acc + Number(a) * Number(b);
  }

    return acc;
}, 0));