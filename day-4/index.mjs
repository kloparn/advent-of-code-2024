import fs from "fs";

const data = fs.readFileSync("data", "utf8").trim().split("\n");

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


const directions = {
  "left" : -1,
  "right": 1,
  "up": -1,
  "down": 1
}

const end = performance.now();

// Part 2

const start2 = performance.now();

const aPositions = data.map((row) => [...row.matchAll(/A/g)].map((it) => it.index)).reduce((acc, curr, index) => {
  acc.push(curr.map((it) => ({ xIndex: it, yIndex: index })));
  return acc;
}, []).flat()

let xMasCount2 = 0;

for (const aPosition of aPositions) {
  // Check only diagonals from the A Position.

  const { yIndex, xIndex } = aPosition;
  const { left, right, up, down } = directions;

  // If we at an edge, we do not need to check the diagonals.
  if (yIndex === 0 || yIndex === data.length - 1 || xIndex === 0 || xIndex === data[yIndex].length - 1) {
    continue;
  }

  /*
    if check looking for this pattern
      M . S
      . A .
      M . S

      This pattern can be rotated in 4 ways, so we need to check all 4.
  */

  if (data[yIndex + up]?.[xIndex + left] === "M" && data[yIndex + down]?.[xIndex + right] === "S") {
    if (data[yIndex + down]?.[xIndex + left] === "M" && data[yIndex + up]?.[xIndex + right] === "S") {
      xMasCount2++;
    } else if (data[yIndex + up]?.[xIndex + right] === "M" && data[yIndex + down]?.[xIndex + left] === "S") {
      xMasCount2++;
    }
  } else if (data[yIndex + up]?.[xIndex + right] === "M" && data[yIndex + down]?.[xIndex + left] === "S") {
    if (data[yIndex + down]?.[xIndex + right] === "M" && data[yIndex + up]?.[xIndex + left] === "S") {
      xMasCount2++;
    } else if (data[yIndex + up]?.[xIndex + left] === "M" && data[yIndex + down]?.[xIndex + right] === "S") {
      xMasCount2++;
    }
  } else if (data[yIndex + down]?.[xIndex + left] === "M" && data[yIndex + up]?.[xIndex + right] === "S") {
    if (data[yIndex + up]?.[xIndex + left] === "M" && data[yIndex + down]?.[xIndex + right] === "S") {
      xMasCount2++;
    } else if (data[yIndex + down]?.[xIndex + right] === "M" && data[yIndex + up]?.[xIndex + left] === "S") {
      xMasCount2++;
    }
  } else if (data[yIndex + down]?.[xIndex + right] === "M" && data[yIndex + up]?.[xIndex + left] === "S") {
    if (data[yIndex + up]?.[xIndex + right] === "M" && data[yIndex + down]?.[xIndex + left] === "S") {
      xMasCount2++;
    } else if (data[yIndex + down]?.[xIndex + left] === "M" && data[yIndex + up]?.[xIndex + right] === "S") {
      xMasCount2++;
    }
  }
}

console.log("Part 1: ", xMasCount, "Time: ", end - start + "ms");
console.log("Part 2: ", xMasCount2, "Time: ", performance.now() - start2 + "ms");

// Pc: 1300ms, mac: 700ms.
// Dynamic programming approach, could be faster with more rules, or less checks.