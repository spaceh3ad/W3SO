const { exec } = require("child_process");

let cmd = `docker run mythril/myth analyze -a 0x24864D7e4fF04e618B9F309e50f9adE77Ace8199 --execution-timeout 200 --infura-id 0747507e119b4584bcf01bd7638cbb7a -o jsonv2`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
  // return parseResult(stdout);
});
