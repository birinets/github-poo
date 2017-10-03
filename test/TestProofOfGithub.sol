pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfGithub.sol";


contract TestProofOfGithub {

  function testDeployed() {
    ProofOfGithub pom = ProofOfGithub(DeployedAddresses.ProofOfGithub());

    Assert.equal(pom.stub(), 1, "Stub should be 1");
  }

}
