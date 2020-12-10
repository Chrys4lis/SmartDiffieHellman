 
const SmartDiffieHellman = artifacts.require("SmartDiffieHellman");
var SEEDS = require("./seeds.js");

contract("SmartDiffieHellman", (accounts) => {
	const instances = 2;
	var contracts = [];

	// Deploys SmartDiffieHellman independently from migrations 
	before(async () => {
		for(let i = 0; i < instances; i++) 
			contracts = [...contracts, SmartDiffieHellman.new()];

		await Promise.all(contracts).then((instances) => {
			contracts = instances;
		})
	});

	it("should be different contracts", () => {
		for(let i = 0; i < contracts.length - 1; i++) {
			assert.ok(contracts[i].address, "Contract " + i + " has not been deployed");

			for(let j = i + 1; j < contracts.length; j++) 
				assert.notEqual(contracts[i].address, contracts[j].address, "Contract " + i + " and contract " + j + " should be different");
		}
	});

	it("should exchange one and the same key between two clients", async () => {
		const contract1 = contracts[0];
		const contract2 = contracts[1];

		let aA = await contract1.generateA.call([SEEDS.SEED1]);
		await contract1.transmitA(contract2.address, aA["_A"]);

		assert.ok(aA["_a"], "Missing 'a' in contract 1");
		assert.ok(aA["_A"], "Missing 'A' in contract 1");

		let bB = await contract2.generateA.call([SEEDS.SEED2]);
		await contract2.transmitA(contract1.address, bB["_A"]);

		assert.ok(bB["_a"], "Missing 'b' in contract 2");
		assert.ok(bB["_A"], "Missing 'B' in contract 2");

		let AB1 = await contract1.generateAB.call(aA["_a"]);
		let AB2 = await contract2.generateAB.call(bB["_a"]);

		assert.equal(AB1.toString(), AB2.toString(), "Exchanged keys keys are not the same");
	});
});