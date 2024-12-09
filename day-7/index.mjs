import fs from "fs";

const data = fs.readFileSync("data", "utf8").trim().split("\n");

const equations = data.map((line) => {
  let [answer, equation] = line.split(":");

  return {
    answer: Number(answer.trim()),
    equation: equation.trim().split(" ").map(Number),
  }
});

const solve = (equations, part2) =>{
  for (const { answer, equation } of equations) {
    if (equation.length === 1 && equation[0] === answer) {
      validAnswers.push(answer);
      continue;
    }

    const queue = [{ equation, index: 0, result: 0 }];

    while (queue.length) {
      const { equation, index, result } = queue.shift();

      if (index > equation.length || result > answer) continue;

      if (index === equation.length) {
        if (result === answer) {
          validAnswers.push(answer);
          break;
        }
        continue;
      }

      const value = equation[index];

      queue.push({ equation, index: index + 1, result: result + value });
      queue.push({ equation, index: index + 1, result: result * value });

      if (part2) queue.push({ equation, index: index + 1, result: Number(String(result) + String(value)) });
    }
  }
}

const validAnswers = [];

solve(equations, false);

console.log("Part 1:", validAnswers.reduce((acc, num) => acc + num, 0));

validAnswers.length = 0;
solve(equations, true);

console.log("Part 2:", validAnswers.reduce((acc, num) => acc + num, 0));