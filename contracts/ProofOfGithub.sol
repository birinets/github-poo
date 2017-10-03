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
        address addr;
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
        // Check that claim url does not already exist
        uint8 claimNo = getClaimNo(_url);

        if ( claimNo == 0 ) {
            totalClaims[msg.sender]++; // TODO: use safeMath // Note: value 0 is used as error value

            claimNo = totalClaims[msg.sender];
        }

        // Generate a unique hash that can be checked against
        bytes32 myHash = sha256(block.number, msg.sender, _url);

        // Create a new claim
        Claim memory newClaim = Claim(_url, false, myHash);

        // Store the claim for later use
        claims[msg.sender][claimNo] = newClaim;

        // Emit event
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
            string memory repositoryOwner;
            string memory repository;
            (repositoryOwner, repository) = getOwnerRepository(_url);

            // Get hash from storage
            Claim memory myClaim = claims[msg.sender][claimNo];
            bytes32 hash = myClaim.hash;

            // Create api url
            string memory queryString = createGithubQuery(repositoryOwner, repository, hash);
            bytes32 myid = oraclize_query("URL", queryString);

            // Save ClaimReference for use in __callback
            ClaimReference memory myClaimReference = ClaimReference(claimNo, msg.sender);
            myidLookup[myid] = myClaimReference;
        }
    }

    /*
     * Oraclize callback function
     * @params myid Unique id for each query
     * @params result Result of query
     */
    function __callback(bytes32 myid, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert();

        ClaimReference memory claimref = myidLookup[myid];

        if( claimref.addr == 0) {
            // Myid was not assigned to a valid ClaimReference
            revert();
        } else {
            // Check that result was expected
            if ( resultIsCorrect(result) ) {
                Claim memory myClaim = claims[claimref.addr][claimref.claimNo];

                myClaim.status = true;
                claimValidated(claimref.addr, myClaim.url);
            }
        }
    }

    /*
     * Returns the claim number corresponding to an address and url. Returns 0 if not found
     * @params _url the url that was claimed
     */
    function getClaimNo(string _url) internal returns (uint8) {
        for (uint8 i = 0; i < 256; i++) {
            Claim memory myClaim = claims[msg.sender][i];

            if( stringsEqual(myClaim.url, _url) ) {
                return i;
            }
        }
        return 0;
    }

    /*
     * Returns true if two strings are the username
     * @params a The first string to compare
     * @params b The second string to compare
     */
    // Obtained from https://forum.ethereum.org/discussion/3238/string-compare-in-solidity
    function stringsEqual(string memory _a, string memory _b) internal returns (bool) {
		bytes memory a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		// @todo unroll this loop
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}

	// https://github.com/ugmo04/github-poo

	/*
     * Returns the owner and repository name from a supplied url
     * @params _url The Github url
     */
    function getOwnerRepository(string _url) constant internal returns (string, string) {
        strings.slice memory surl = _url.toSlice();
        strings.slice memory sgit = "https://github.com/".toSlice();
        strings.slice memory sown = surl.copy().beyond(sgit).until("/".toSlice());
        strings.slice memory srep = surl.beyond(sown);
        return (sown.toString(), srep.toString());
    }

    /*
     * Returns a string which can be passed to Oraclize to check if the hashed
     * file was placed in a Github repository
     * @params _repositoryOwner The username of the repository owner
     * @params _repository The repository name
     * @params _hash The hash that should be found
     */
    function createGithubQuery(string _repositoryOwner, string _repository, bytes32 _hash) constant internal returns (string) {
        string memory s1 = 'https://api.github.com/repos/"';
        string memory s3 = "";
        string memory s5 = '/contents/proofs';
        string memory s7 = '.txt';

        bytes memory result = concatBytes(bytes(s1), bytes(_repositoryOwner), bytes(s3), bytes(_repository), bytes(s5), bytes(bytes32ToString(_hash)), bytes(s7));
        return string(result);
    }

    /**
     * Returns a concatenation of seven bytes.
     * @param b1 The first bytes to be concatenated.
     * ...
     * @param b7 The last bytes to be concatenated.
     */
    function concatBytes(bytes b1, bytes b2, bytes b3, bytes b4, bytes b5, bytes b6, bytes b7) internal returns (bytes bFinal) {
        bFinal = new bytes(b1.length + b2.length + b3.length + b4.length + b5.length + b6.length + b7.length);

        uint i = 0;
        uint j;
        for (j = 0; j < b1.length; j++) bFinal[i++] = b1[j];
        for (j = 0; j < b2.length; j++) bFinal[i++] = b2[j];
        for (j = 0; j < b3.length; j++) bFinal[i++] = b3[j];
        for (j = 0; j < b4.length; j++) bFinal[i++] = b4[j];
        for (j = 0; j < b5.length; j++) bFinal[i++] = b5[j];
        for (j = 0; j < b6.length; j++) bFinal[i++] = b6[j];
        for (j = 0; j < b7.length; j++) bFinal[i++] = b7[j];
    }

    /*
     * Converts a bytes32 to a string
     */
    // Obtained from https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
    function bytes32ToString(bytes32 x) constant internal returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }


    /*
     * Returns true when the result is the expected string
     * @params result The result string to compare against
     */
    function resultIsCorrect(string result) constant internal returns (bool) {
        // TODO
        return true;
    }
}
