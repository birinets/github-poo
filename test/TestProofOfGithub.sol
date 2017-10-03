pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfGithub.sol";


contract TestProofOfGithub {

  function testCreateClaim() {
    ProofOfGithub pom = ProofOfGithub(DeployedAddresses.ProofOfGithub());

    uint myTotalClaims = pom.totalClaims(msg.sender);
    Assert.equal(myTotalClaims, 0, "Should originally have 0 claims");

    pom.createClaim("https://github.com/ugmo04/github-poo/");

    myTotalClaims = pom.totalClaims(msg.sender);
    Assert.equal(myTotalClaims, 1, "Should now have 1 claim");
  }

}
