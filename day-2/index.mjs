import fs from "fs";

const data = fs.readFileSync("data", "utf8").trim().split("\n").map((line) => line.split(" ").map(Number));

let safeDataReports = 0;
outer: for (const report of data) {
  if (report[0] < report[1]) {
    for(let i = 0; i < report.length; i++) {
      if (report[i + 1] === undefined) break;
  
      if (report[i + 1] - report[i] > 3 || (report[i + 1] - report[i] < 1)) continue outer;
    }
  } else {
      for(let i = 0; i < report.length; i++) {
        if (report[i +  1] === undefined) break;
    
        if (report[i] - report[i + 1] > 3 || (report[i] - report[i + 1] < 1)) continue outer;
    }	
  }

  safeDataReports++;
}

console.log("part1: ", safeDataReports);

let part2 = 0;

outer: for (const report of data) {
  // create a remove counter.
  let removedPoints = 0;

  // iterate over the points
  // if a point does not go with our rules, remove it and try again once.

  // increasing order report.
  if (report[0] < report[1]) {
    for (let i = 0; i < report.length - 1; i++) {

      if (report[i + 1] - report[i] > 3 || (report[i + 1] - report[i] < 1)) {
        if (removedPoints === 1) {
          continue outer;
        }
        report.splice(i, 1);

        removedPoints++;
        i -= 2;
      }
    }
  } else { 
    for (let i = 0; i < report.length - 1; i++) {

      if (report[i] - report[i + 1] > 3 || (report[i] - report[i + 1] < 1)) {
        if (removedPoints === 1) {
          continue outer;
        }
        report.splice(i, 1);
        removedPoints++;

        i -= 2;
      }
    }
  }
 
  // if we reach here, we have a valid report.
  part2++;
}


console.log("part2: ", part2);