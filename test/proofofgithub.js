var ProofOfGithub = artifacts.require("./ProofOfGithub.sol");

contract('ProofOfGithub', function(accounts) {

  it("totalClaims is originally 0", () => {
    return ProofOfGithub.deployed().then( (instance) => {
      // console.log(instance);
      return instance.totalClaims.call(accounts[0]);;
    }).then( (myTotalClaims) => {
      assert.equal(myTotalClaims, 0);
    })
  })

})
