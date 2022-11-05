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
const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data);
  const validator = new Validator(input, customParams);

  const jobRunID = validator.validated.id;
  const endpoint = validator.validated.data.endpoint || ""; // Note: - no endpoint param in this example. Endpoint means  REST resource.
  const address = validator.validated.data.address;

  let score = lib.mythrilScan(address);

  let result = {
    address: address,
    score: score,
  };

  let response = {};

  response.data = {
    result: result,
    date: "",
  };

  callback(200, Requester.success(jobRunID, response));
};

module.exports.createRequest = createRequest;
