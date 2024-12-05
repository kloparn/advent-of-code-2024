import fs from "fs";

// Setup the rules
const [rules, pages] = fs.readFileSync("data", "utf8").trim().split("\r\n\r\n").reduce(((acc, curr) => {  
  if (curr.includes("|")) {
    const pages = curr.split(/\r\n/)

    for (const page of pages) {
      acc[0][page] = true;
    }
    return acc;
  } else {
    acc[1].push(curr.split("\n"));
    acc[1] = acc[1].flat();
    return acc;
  }
}), [{}, []]);

// get the valid pages and invalid pages.

const validPages = [];
const invalidPages = [];

outer: for (const page of pages) {
  const pageNumbers = page.split(",").map(Number);

  for (let i = 0; i < pageNumbers.length - 1; i++) {
    const left = pageNumbers[i];
    const right = pageNumbers[i + 1];

    if (!rules[`${left}|${right}`]) {
      invalidPages.push(pageNumbers);
      continue outer;
    }
  }

  validPages.push(pageNumbers);
}

// part 1: get the middle section of each page and add them together
console.log("Part 1:", validPages.reduce((acc, curr) => {
  const middleIndex = Math.floor(curr.length / 2);
  return acc + curr[middleIndex];
}, 0))

// part 2: order invalid pages by the rules then count the middle sections like before.

const correctlyShuffled = [];

while(invalidPages.length) {
  const page = invalidPages[0];

  // Using sliding window that has the whole page length,
  // we can check the orders of all the elements.

  const newPage = [];

  let left = 0;
  let right = page.length - 1;
  while(page.length) {
    const leftValue = page[left];
    const rightValue = page[right];

    if (rules[`${leftValue}|${rightValue}`]) {
      right--;
    } else if (rules[`${rightValue}|${leftValue}`]) {
      left++;
    }

    if (left === right) {
      newPage.push(page[left]);
      // splice out the pageNumber that had the correct order.
      page.splice(left, 1);
      left = 0;
      right = page.length - 1;
    }
  }

  // page has now been arranged correctly.
  correctlyShuffled.push(newPage);
  invalidPages.shift();
}

console.log("Part 2:", correctlyShuffled.reduce((acc, curr) => {
  const middleIndex = Math.floor(curr.length / 2);
  return acc + curr[middleIndex];
}, 0));