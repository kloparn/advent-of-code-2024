import fs from "fs";

// Setup the rules
const [rules, pages] = fs.readFileSync("data", "utf8").trim().split(/\n\n/).reduce(((acc, curr) => {
  if (curr.includes("|")) {
    const pages = curr.split(/\n/)

    for (const page of pages) {
      const [page1, page2] = page.split("|");
        acc[0][page1] = {
          ...acc[0][page1],
          [page2]: true,
        };
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

  for (let i = pageNumbers.length - 1; i >= 0; i--) {
    let page = pageNumbers[i];

    for (let j = i + 1; j < pageNumbers.length; j++) {
      // check the order of the pages that they match the rules.
      const underPage = pageNumbers[j];

      if (!rules[page]?.[underPage]) {
        invalidPages.push(pageNumbers);
        continue outer;
      }
      page = underPage;
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

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

const correctlyShuffled = [];

let index = 0;
outer: while(invalidPages.length) {
  for (const page of invalidPages) {
    shuffle(page);
  }

  index++;

  for (const pageNumbers of invalidPages) {

    for (let i = pageNumbers.length - 1; i >= 0; i--) {
      let page = pageNumbers[i];

      // add a variable to make sure that we don't get stuck in loops.
      const checked = {};

      for (let j = i + 1; j < pageNumbers.length; j++) {
        // check the order of the pages that they match the rules.
        const underPage = pageNumbers[j];

        if (!rules[page]?.[underPage] || checked[underPage]) {
          if (checked[underPage]) {
            console.log("Stuck in loop")
          }
          continue outer;
        }

        checked[underPage] = true;
        page = underPage;
      }
    }
    // console.log(pageNumbers)
    console.log("Shuffled", index, "times")
    correctlyShuffled.push(invalidPages.shift());
  }
}

console.log("Part 2:", correctlyShuffled.reduce((acc, curr) => {
  const middleIndex = Math.floor(curr.length / 2);
  return acc + curr[middleIndex];
}, 0));