pragma solidity >=0.5.0 <0.7.1;


import "./BigMod.sol";

contract SmartDiffieHellman {
	using BigMod for uint256;

	uint256 public P = 0xF3EC75CC015A7F458C242E37C292EEF96C40CFB670ED8CFF3BBA27EE3301205B;
	uint256 public G = 2;

	uint256 public B;

	address other;

	// original strings for testing in migrations
	string public jsInitTransmit = "const secureRandom = require(\"secure-random\"); let random = secureRandom(32, {type: \"Array\"}); let genAa = await dhInst1.generateA.call(random); await dhInst1.transmitA(dhInst2.address, genAa[\"_A\"]); return genAa;";
	string public jsCalcSecret = "return await dhInst.generateAB.call(genAa[\"_a\"]);";

	// string for test 2
	string public jsGetRandom = "(() => {const secureRandom = require(\"secure-random\"); return secureRandom(32, {type: \"Array\"});})()";

	function generateA(uint256[] memory _seed) public view returns (uint256 _a, uint256 _A) {
		assert(P != 0);
		assert(G != 0);

		_a = uint256(keccak256(abi.encodePacked(_seed)));
		_A = G.bigMod(_a, P);
	}

	function transmitA(SmartDiffieHellman _other, uint256 _A) public {
		require(address(_other) != address(0), "Other SmartDiffieHellman contract unassigned.");
		require(P == _other.P(), "Prime is different.");
		require(G == _other.G(), "Root is different.");

		_other.setB(_A);
	}


	function generateAExtB(uint256 _a, uint256 _B) public view returns (uint256 _AB) {
		_AB = _B.bigMod(_a, P);
	}

	function generateAB(uint256 _a) public view returns (uint256 _AB) {
		require(address(other) != address(0), "Other SmartDiffieHellman contract unassigned.");
		require(B != 0, "B has not been transmitted by other SmartDiffieHellman.");

		_AB = B.bigMod(_a, P);
	}

	function setB(uint256 _B) public {
		other = msg.sender;
		B = _B;
	}

	function stop() public {
		selfdestruct(msg.sender);
	}
}