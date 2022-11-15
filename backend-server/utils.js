require("dotenv").config();
const { Web3Storage, File } = require("web3.storage");

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3_STORAGE });
}

function makeFileObjects(result) {
  const buffer = Buffer.from(JSON.stringify(result));

  const file = [new File([buffer], `metadata.json`)];
  return file;
}

async function parseResult(report) {
  // 1 => contract safe no issues found
  // 0.05 => dangerous

  // high => 5
  // medium => 3
  // low => 1

  // score = 1/[num_of_issues]/[sum_of_all_issues]

  let result = {
    score: 0,
    report: report,
  };

  if (report[0].issues === []) {
    return 1; //asume contract ok if no issues found
  } else {
    let issuesArr = report[0].issues;
    for (let index = 0; index < issuesArr.length; index++) {
      if (issuesArr[index].severity === "Medium") {
        result.score += 3;
      } else if (issuesArr[index].severity === "High") {
        result.score += 5;
      } else {
        // low
        result.score += 1;
      }
    }

    result.score = (1 / issuesArr.length / result.score) * 10_000;
    console.log("Uploading result to IPFS");
    const client = makeStorageClient();
    const reportObj = makeFileObjects(result);
    const cid_metadata = await client.put(reportObj);
    console.log(`Uploaded to IPFS at : https://${cid_metadata}.ipfs.w3s.link/`);

    return {
      score: String(result.score).valueOf(),
      cid: `https://${cid_metadata}.ipfs.w3s.link/`,
    };
  }
}

async function mythrilScan(address) {
  let cmd = `docker run mythril/myth analyze -a ${address} --execution-timeout 100 --infura-id ${process.env.INFURA_ID} -o jsonv2`;

  const execSync = require("child_process").execSync;
  console.log(`Job for ${address} spawned`);
  const result = execSync(cmd);
  const resultParsed = JSON.parse(result.toString("utf8"));
  let meta = resultParsed[0].meta;

  console.log(
    `Elapsed in ${
      meta.mythril_execution_info.analysis_duration / 1000000000.0
    } sec.`
  );
  return await parseResult(resultParsed);
}

module.exports = { mythrilScan };
