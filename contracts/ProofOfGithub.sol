pragma solidity ^0.4.17;

import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "github.com/Arachnid/solidity-stringutils/strings.sol";

/**
 * @title ProofOfGithub
 * @dev Makes claims that a Github repository is controlled by an address
 */
contract ProofOfGithub is Ownable, usingOraclize {
    using strings for *;

    struct Claim {
        string url;
        bool status;
        bytes32 hash;
    }

    struct ClaimReference {
        uint8 claimNo;
        string url;
    }

    mapping (address => mapping (uint8 => Claim)) public claims; // Limit user to 256 claims for now
    mapping (bytes32 => ClaimReference) public myidLookup;
    mapping (address => uint8) public totalClaims;

    event claimCreated(address claimant, string GithubURL, bytes32 hash);
    event claimValidated(address claimant, string GithubURL);

    function ProofOfGithub() public {}

    /*
     * Creates a claim on a Github URL
     * @params _url The Github URL that will be claimed
     */
    function createClaim(string _url) external {
        totalClaims[msg.sender]++; // TODO: use safeMath // Note: value 0 is used as error value


        // TODO: check that new claim does not already exist

        // Generate a unique hash that can be checked against
        bytes32 myHash = sha256(block.number, msg.sender, _url);

        // Create a new claim
        Claim memory newClaim = Claim(_url, false, myHash);

        // Store the claim for later use
        uint8 claimNo = totalClaims[msg.sender];
        claims[msg.sender][claimNo] = newClaim;

        claimCreated(msg.sender, _url, myHash);
    }

    /*
     * Validates a claim on a Github URL
     * @params _url The Github URL to be validated
     */
    function validateClaim(string _url) external {
        // Check that claim has been made and get claimNo
        uint8 claimNo = getClaimNo(_url);
        if (claimNo == 0) {
            // Claim does not exist
            revert();
        } else {
            // Get owner and repository from URL
            Claim memory myClaim = claims[msg.sender][claimNo];
            string memory repositoryOwner;
            string memory repository;
            (repositoryOwner, repository) = getOwnerRepository(_url);

            // Get hash from storage
            bytes32 hash = claims[msg.sender][claimNo].hash;

            // Create api url
            string memory queryString = createGithubQuery(repositoryOwner, repository, hash);
            bytes32 myid = oraclize_query("URL", queryString);

            // Save ClaimReference for use in __callback
            ClaimReference memory myClaimReference = ClaimReference(claimNo, _url);
            myidLookup[myid] = myClaimReference;
        }
    }

    /*
     * Oraclize callback function
     * @params myid Unique id for each query
     * @params result Result of query
     */
    function __callback(bytes32 myid, string result) external {
        if (msg.sender != oraclize_cbAddress()) throw;
        // TODO
    }

    /*
     * Returns the claim number corresponding to an address and url. Returns 0 if not found
     * @params _url the url that was claimed
     */
    function getClaimNo(string _url) internal returns (uint8) {
        // TODO
        return 0;
    }

    /*
     * Returns a string which can be passed to Oraclize to check if the hashed
     * file was placed in a Github repository
     * @params _repositoryOwner The username of the repository owner
     * @params _repository The repository name
     * @params _hash The hash that should be found
     */
    function createGithubQuery(string _repositoryOwner, string _repository, bytes32 _hash) internal returns (string) {
        // TODO
        return "";
    }

    /*
     * Returns the owner and repository name from a supplied url
     * @params _url The Github url
     */
    function getOwnerRepository(string _url) internal returns (string, string) {
        // TODO
        return ("", "");
    }
}
