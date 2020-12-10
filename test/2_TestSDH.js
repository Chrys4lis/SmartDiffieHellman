
const SmartDiffieHellman = artifacts.require("SmartDiffieHellman");

contract("SmartDiffieHellman", (accounts) => {
    let contract1, contract2;

	// Deploys SmartDiffieHellman independently from migrations
    before(async () => {
        contract1 = await SmartDiffieHellman.new();
        contract2 = await SmartDiffieHellman.new();
	});


	it("should be different contracts", () => {
        assert.ok(contract1.address, "Contract1 has not been deployed");
        assert.ok(contract2.address, "Contract2 has not been deployed");
        assert.notEqual(contract1.address, contract2.address, "Contracts should be different");
	});

	it("should exchange one and the same key between two clients", async () => {
        let jsGetRandom = await contract1.jsGetRandom.call();
        let random1 = eval(jsGetRandom);
        let random2 = eval(jsGetRandom);

/*
        console.log("random1: " + random1);
        console.log("random2: " + random2);
*/

		let aA = await contract1.generateA.call([random1]);
		await contract1.transmitA(contract2.address, aA["_A"]);

	    assert.ok(aA["_a"], "Missing 'a' in contract 1");
		assert.ok(aA["_A"], "Missing 'A' in contract 1");

		let bB = await contract2.generateA.call([random2]);
		await contract2.transmitA(contract1.address, bB["_A"]);

		assert.ok(bB["_a"], "Missing 'b' in contract 2");
		assert.ok(bB["_A"], "Missing 'B' in contract 2");

		let AB1 = await contract1.generateAB.call(aA["_a"]);
		let AB2 = await contract2.generateAB.call(bB["_a"]);

        assert.equal(AB1.toString(), AB2.toString(), "Exchanged keys keys are not the same");

/*
        console.log("a: " + aA["_a"]);
        console.log("A: " + aA["_A"]);
        console.log("b: " + bB["_a"]);
        console.log("B: " + bB["_A"]);
        console.log("AB1: " + AB1);
        console.log("AB2: " + AB2);
*/
	});
});