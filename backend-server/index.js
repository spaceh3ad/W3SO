const { Requester, Validator } = require("@chainlink/external-adapter");
require("dotenv").config();

const lib = require("./utils.js");

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  target: ["target"],
  endpoint: false,
};

/**
 *
 * @param {any} input
 * @param {(status:number, result:any)=>{}} callback
 */
const createRequest = async (input, callback) => {
  // The Validator helps you validate the Chainlink request data);
  const validator = new Validator(input, customParams);

  const jobRunID = validator.validated.id;
  const target = validator.validated.data.target;

  let report = await lib.mythrilScan(target);
  report.address = target;

  const response = { date: "", result: report };

  console.log("Done!");

  response.data = {
    result: report,
  };

  callback(200, Requester.success(jobRunID, response));
};

module.exports.createRequest = createRequest;
