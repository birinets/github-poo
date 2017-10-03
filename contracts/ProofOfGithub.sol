pragma solidity ^0.4.11;

// import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
import './Ownable.sol';

contract ProofOfGithub is Ownable {
    struct Claim {
        string url;
        bool status;
        bytes32 hash;
        uint ref;
    }

    mapping (address => mapping (uint8 => Claim)) public claims; // Limit user to 256 claims for now
    mapping (address => uint8) public totalClaims;

    event claimCreated(address claimant, string GithubURL, bytes32 hash);
    event claimValidated(address claimant, string GithubURL);

    function ProofOfGithub() public {}

    /*
     * Creates a claim on a Github URL
     * @params _url The Github URL that will be claimed
     */
    function createClaim(string _url) external {
        oracle200Emulator(_url);
    }

    /*
     * Validates a claim on a Github URL
     * @params _url The Github URL to be validated
     */
    function validateClaim(string _url) external {

    }

    /*
     * Creates a manual claim for the purpose of testing
     * @params _url The Github URL to be validated
     * @params _hash The hash that will be used to validate the Github repository
     */
    function createManualClaim(string _url, bytes32 _hash) external onlyOwner {

    }

    uint ref = 0;
    event oracleLog(address _addr, string _url, uint _ref);
    function oracle200Emulator(string _url) returns (uint) {
        ref++; // TODO: implement safemath
        oracleLog(msg.sender, _url, ref);
        return ref;
    }

    function __callback(string _url, bool _result, uint _ref) external {

    }

}
