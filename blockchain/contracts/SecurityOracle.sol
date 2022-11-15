// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ClientContract.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
using Strings for address;

/// @notice Web3 Secrutiy Oracle
contract SecurityOracle is ClientContract {
    mapping(address => Score) public addressToResult;

    struct Score {
        uint8 sscore; // security-score
        string uri; // ipfs link to report
    }

    function safeCall(address targetContract) public {
        require(isContract(targetContract), "Must be a contract");
        requestInfo(
            0x2dbDFd16806C9A52A08c61485fc47420Ba6Baed6,
            "39807071b2ea49a386db57073e35911d",
            Strings.toHexString(targetContract) // req need string
        );
    }

    function fulfillRequestInfo(
        bytes32 _requestId,
        address _target,
        uint8 _score,
        string memory _uri
    ) public recordChainlinkFulfillment(_requestId) {
        addressToResult[_target] = Score({sscore: _score, uri: _uri});
        emit RequestForInfoFulfilled(_requestId, _target, _score);
    }

    function isContract(address _addr) internal view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }
}
