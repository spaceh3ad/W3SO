# INTRODUCTION

This is a project repo for the [Chainlink Fall 2022 Hackathon](https://chain.link/hackathon).
The project is called W3SO - Web3 Security Oracle - which allows providing the security analysis score on-chain.

# Recommended Prerequisites

# Repo Structure

# Getting Started

## Request Data

`curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 10, "data": { "number":19, "infoType": "math" } }'` for the API to provide some math fact about the number `19`.

When interacting with a Chainlink Node, the External Adapter will receive a post request that looks something like this:

```
{
  data: { infoType: 'trivia', number: '9' },
  id: '0x93fd920063d2462d8dce013a7fc75656',
  meta: {
    oracleRequest: {
     // .... some data ....
    }
  }
}

```

## Response Data

Our external adapter returns data in the following structure ([docs](https://docs.chain.link/docs/developers/#returning-data)). Not all fields are required though.

```
returned response:   {
  jobRunId: '0x93fd920063d2462d8dce013a7fc75656',
  statusCode: 200,
  data: {
    result: "9 is the number of circles of Hell in Dante's Divine Comedy."
  }
}
```

# Architecture Diagram

![alt Architecture Drawing Showing The Interaction within the System](../architecture.png "Architecture Diagram")
