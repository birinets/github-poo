pragma solidity ^0.4.11;

// import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
import './Ownable.sol';

contract ProofOfGithub is Ownable {
// contract ProofOfGithub {
    struct Claim {
        string url;
        bool status;
        bytes32 hash;
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

}
