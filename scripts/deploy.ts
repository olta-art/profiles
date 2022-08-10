import { ethers } from "hardhat";

async function main() {
  const Profiles = await ethers.getContractFactory("Profiles");
  const profiles = await Profiles.deploy();

  await profiles.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
