
var BigMod = artifacts.require("./BigMod.sol");
var SmartDiffieHellman = artifacts.require("./SmartDiffieHellman.sol");

module.exports = function(deployer) {
  var dhInst1;
  var dhInst2;

  var dhInst1aA;
  var dhInst2bB;

  var jsInitTransmit, jsCalcSecret;

  deployer.deploy(BigMod)
    .then(() => {
      return deployer.link(BigMod, SmartDiffieHellman);
    })
    .then(() => {
      return deployer.deploy(SmartDiffieHellman);
    })
    .then((instance1) => {
      dhInst1 = instance1;

      return deployer.deploy(SmartDiffieHellman);
    })
    .then((instance2) => {
      dhInst2 = instance2;
    })
    .then(() => {
      return dhInst1.jsInitTransmit.call();
    })
    .then((js) => {
      jsInitTransmit = js;
    })
    .then(() => {
      return dhInst1.jsCalcSecret.call();
    })
    .then((js) => {
      jsCalcSecret = js;

      return eval("(async (dhInst1, dhInst2) => {" + jsInitTransmit + "})(dhInst1, dhInst2)");
    })
    .then(async (aA) => {
        dhInst1aA = aA;
    })
    .then(() => {
        return eval("(async (dhInst1, dhInst2) => {" + jsInitTransmit + "})(dhInst2, dhInst1)");
    })
    .then((bB) => {
        dhInst2bB = bB;
    })
    .then(() => {
        return eval("(async (dhInst, genAa) => {" + jsCalcSecret + "})(dhInst1, dhInst1aA)");
    })
    .then((shared) =>{
        console.log("1: " + shared);
    })
    .then(() => {
        return eval("(async (dhInst, genAa) => {" + jsCalcSecret + "})(dhInst2, dhInst2bB)");
    })
    .then((shared) =>{
        console.log("2: " + shared);
    });
};
