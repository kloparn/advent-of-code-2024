import fs from "fs";

const data = fs.readFileSync("data", "utf8").trim().split("\n").map((line) => ([Number(line.split(" ")[0]), Number(line.split(" ").at(-1))]));

const arr1 = data.map((line) => line[0]).sort((a, b) => a - b);
const arr2 = data.map((line) => line[1]).sort((a, b) => a - b);

let sum = 0;

for (let i = 0; i < arr1.length; i++) {
  sum += Math.abs(arr1[i] - arr2[i]);
}


const arr2EntryCount = {};

for (const entry of arr2) {
  arr2EntryCount[entry] = arr2EntryCount[entry] ? arr2EntryCount[entry] + 1 : 1;
}

let sum2 = 0;

for (const entry of arr1) {
  if (arr2EntryCount[entry]) sum2 += entry * arr2EntryCount[entry];
}

console.log("part1: ", sum);
console.log("part2: ", sum2)