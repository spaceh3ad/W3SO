// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @notice Web3 Secrutiy Oracle
/// @notice allows to retrive a security score for smart contract
contract SecurityOracle is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using Strings for address;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18

    mapping(address => Score) public addressToResult;

    struct Score {
        int16 sscore; // security-score
        string uri; // ipfs link to report
    }

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        address targetContract,
        int16 score
    );

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    }

    function securityScan(address targetContract) public {
        require(
            addressToResult[targetContract].sscore == 0x0,
            "Address already scanned - check mapping for info"
        );
        requestInfo(
            0x2dbDFd16806C9A52A08c61485fc47420Ba6Baed6,
            "e30b1e90c2f3403a802300a37bfec02f",
            Strings.toHexString(targetContract) // req need string
        );
    }

    function requestInfo(
        address _oracle,
        string memory _jobId,
        string memory target
    ) internal {
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );

        req.add("target", target);

        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillRequestInfo(
        bytes32 _requestId,
        address _target,
        int16 _score,
        string memory _uri
    ) public recordChainlinkFulfillment(_requestId) {
        addressToResult[_target] = Score({sscore: _score, uri: _uri});
        emit RequestForInfoFulfilled(_requestId, _target, _score);
    }

    /*
    ========= UTILITY FUNCTIONS ==========
    */

    function contractBalances()
        public
        view
        returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
