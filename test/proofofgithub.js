var ProofOfGithub = artifacts.require("./ProofOfGithub.sol");

contract('ProofOfGithub', function(accounts) {

  it("Stub", () => {
    return ProofOfGithub.deployed().then( (instance) => {
      // console.log(instance);
      return instance.stub.call();
    }).then( (stub) => {
      // done();
      assert.equal(stub, 1);
    })
  })
  
})
