import fs from "fs";
const data = fs.readFileSync("data", "utf8").trim().split(/\n/);

const startPosition = data.reduce((guard, curr, index) => (curr.indexOf("^") !== -1 ? { x: curr.indexOf("^"), y: index} :guard), { x: 0, y: 0})
let guardPosition = { ...startPosition }

const wallPositions = data.reduce((acc, curr, index) => {
  const walls = curr.split("").reduce((acc, curr, _index) => (curr === "#" ? [...acc, { x: _index, y: index }] : acc), [])
  return [...acc, ...walls]
}, [])

const nextPosition = {
  "^": ">",
  ">": "v",
  "v": "<",
  "<": "^",
}

const directionWallPosition = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  "v": { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
}

let direction = "^"
let seen = {}
let steps = 0

// While guard is still inside the walls
while (guardPosition.x >= 0 && guardPosition.x < data[0].length && guardPosition.y >= 0 && guardPosition.y < data.length) {
  // If the guard is facing a wall, turn right
  if (wallPositions.some(wall => wall.x === guardPosition.x + directionWallPosition[direction].x && wall.y === guardPosition.y + directionWallPosition[direction].y)) {
    direction = nextPosition[direction]
  }

  // Move the guard
  if (direction === "^") {
    guardPosition.y--;
  } else if (direction === ">") {
    guardPosition.x++;
  } else if (direction === "v") {
    guardPosition.y++;
  } else if (direction === "<") {
    guardPosition.x--;
  }

  if (!seen[`${guardPosition.x},${guardPosition.y}`]) steps++;

  // Add the position to the seen positions
  seen[`${guardPosition.x},${guardPosition.y}`] = direction;
}


console.log("Part 1:", steps - 1)

// Part 2

// reset all
guardPosition = startPosition;
direction = "^"
seen = {}

let loops = 0;
while (guardPosition.x >= 0 && guardPosition.x < data[0].length && guardPosition.y >= 0 && guardPosition.y < data.length) {
  if (wallPositions.some(wall => wall.x === guardPosition.x + directionWallPosition[direction].x && wall.y === guardPosition.y + directionWallPosition[direction].y)) {
    direction = nextPosition[direction]
  }

  seen[`${guardPosition.x},${guardPosition.y}`] = direction;

  if (direction === "^") {
    guardPosition.y--;
  } else if (direction === ">") {
    guardPosition.x++;
  } else if (direction === "v") {
    guardPosition.y++;
  } else if (direction === "<") {
    guardPosition.x--;
  }


  // We check for potential loops if we turn 90 degrees from the current direction
  let loopDirection = nextPosition[direction];
  let tempGuardPosition = { ...guardPosition };

  const tempSeen = {};

  // moving the temp guard until we either reach an already walked path (has to be the same direction) or wall or end of the map
  while (true) {
    // If the guard is facing a wall, turn right
    if (wallPositions.some(wall => wall.x === guardPosition.x + directionWallPosition[direction].x && wall.y === guardPosition.y + directionWallPosition[direction].y)) {
      loopDirection = nextPosition[loopDirection]
    }

    // If we reach the end of the map, we break
    if (tempGuardPosition.x < 0 || tempGuardPosition.x >= data[0].length || tempGuardPosition.y < 0 || tempGuardPosition.y >= data.length) {
      break;
    }

    if (seen[`${tempGuardPosition.x},${tempGuardPosition.y}`] === loopDirection) {
      loops++;
      break;
    }

    if (!tempSeen[`${tempGuardPosition.x},${tempGuardPosition.y},${loopDirection}`]) {
      tempSeen[`${tempGuardPosition.x},${tempGuardPosition.y},${loopDirection}`] = true;
    } else {
      loops++;
      break;
    }

    // Move the temp Guard
    if (loopDirection === "^") {
      tempGuardPosition.y--;
    } else if (loopDirection === ">") {
      tempGuardPosition.x++;
    } else if (loopDirection === "v") {
      tempGuardPosition.y++;
    } else if (loopDirection === "<") {
      tempGuardPosition.x--;
    }
  }
};

console.log("Part 2:", loops);
