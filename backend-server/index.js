const { Requester, Validator } = require("@chainlink/external-adapter");
require("dotenv").config();

const lib = require("./utils.js");

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === "Error") return true;
  return false;
};

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  address: ["address"],
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
  const address = validator.validated.data.address;

  let report = await lib.mythrilScan(address);
  // let report = { score: 0.591, cid: "TEST" };

  const response = { date: "", result: report };

  response.data = {
    result: report,
  };

  callback(200, Requester.success(jobRunID, response));
};

module.exports.createRequest = createRequest;
