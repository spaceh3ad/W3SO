require("dotenv").config();

function parseResult(array) {
  let score = 0;

  // 1 => contract safe no issues found
  // 0.05 => dangerous

  // high => 5
  // medium => 3
  // low => 1

  // score = 1/[num_of_issues]/[sum_of_all_issues]

  if (array[0].issues === []) {
    return 1; //asume contract ok if no issues found
  } else {
    let issuesArr = array[0].issues;
    for (let index = 0; index < issuesArr.length; index++) {
      if (issuesArr[index].severity === "Medium") {
        score += 3;
      } else if (issuesArr[index].severity === "High") {
        score += 5;
      } else {
        // low
        score += 1;
      }
    }
    return 1 / issuesArr.length / score;
  }
}

function mythrilScan(address) {
  let cmd = `docker run mythril/myth analyze -a ${address} --execution-timeout 100 --infura-id ${process.env.INFURA_ID} -o jsonv2`;

  const execSync = require("child_process").execSync;
  const result = execSync(cmd);
  const resultParsed = JSON.parse(result.toString("utf8"));
  return parseResult(resultParsed);
}

module.exports = { mythrilScan };
