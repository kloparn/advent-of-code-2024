import fs from "fs";

const data = fs.readFileSync("example", "utf8").trim().split("\n");

// get all the x positions for each row.
const xPositions = data.map((row) => [...row.matchAll(/X/g)].map((it) => it.index)).reduce((acc, curr, index) => {
  acc.push(curr.map((it) => ({ xIndex: it, row: index, state: 1 })));
  return acc;
}, []).flat();

// now we check all directions to see if they continue the pattern of XMAS.
const patterns = {
  1: "X",
  2: "M",
  3: "A",
  4: "S",
  "X": 1,
  "M": 2,
  "A": 3,
  "S": 4
}

let xMasCount = 0;

const queue = [...xPositions];

const start = performance.now();

while(queue.length > 0) {
  const current = queue.shift();
  const { xIndex, row, state, direction } = current;

  if (row < 0 || row >= data.length || xIndex < 0 || xIndex >= data[row].length) {
    continue;
  }

  if (state === 4) {
    xMasCount++;

    continue;
  }

  // add in queue all 8 directions to pathfind.
  if (!direction) {
    queue.push({...current, direction: "up" });
    queue.push({ ...current, direction: "down" });
    queue.push({ ...current, direction: "right" });
    queue.push({ ...current, direction: "left" });
    queue.push({ ...current, direction: "up-right" });
    queue.push({ ...current, direction: "up-left" });
    queue.push({ ...current, direction: "down-right" });
    queue.push({ ...current, direction: "down-left" });
    continue;
  }

  // check if the next is valid & the value is above the current one..
  if (direction === "up" && data[row - 1]?.[xIndex] === patterns[state + 1]) {
    const next = { xIndex, row: row - 1, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "down" && data[row + 1]?.[xIndex] === patterns[state + 1]) {
    const next = { xIndex, row: row + 1, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "right" && data[row]?.[xIndex + 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex + 1, row, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "left"  && data[row]?.[xIndex - 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex - 1, row, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "up-right" && data[row - 1]?.[xIndex + 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex + 1, row: row - 1, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "up-left" && data[row - 1]?.[xIndex - 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex - 1, row: row - 1, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "down-right" && data[row + 1]?.[xIndex + 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex + 1, row: row + 1, state: state + 1, direction };
    queue.push(next);
  } else if (direction === "down-left"  && data[row + 1]?.[xIndex - 1] === patterns[state + 1]) {
    const next = { xIndex: xIndex - 1, row: row + 1, state: state + 1, direction };
    queue.push(next);
  }
}

// about 700~ms, Dynamic programming approach, could be faster with more rules, or less checks.
console.log("Part 1: ", xMasCount, "Time: ", performance.now() - start + "ms");

const directions = {
  "left" : -1,
  "right": 1,
  "up": -1,
  "down": 1
}

// Part 2

/*
  The pattern has changed, Now we need to look for X-mas patterns, and count them.
  A pattern is if the word MAS is in a cross.
  Example:
    M.S
    .A.
    M.S

  it SHOULD look exactly like this, but it could be rotated, so we need to check all 4 directions of the M spot.

  Now it's less looking for X with regex and more M.A.S with a 3x3 matrix, should be faster as we don't need to path find.
*/

const mPositions = data.map((row) => [...row.matchAll(/M/g)].map((it) => it.index))

const validMPositions = mPositions.reduce((acc, mPosition, rowIndex) => {
  mPosition
}, []);