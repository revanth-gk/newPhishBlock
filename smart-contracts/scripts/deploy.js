async function main() {
  const PhishBlock = await hre.ethers.getContractFactory("PhishBlock");
  const phishBlock = await PhishBlock.deploy();

  await phishBlock.waitForDeployment();

  console.log("PhishBlock deployed to:", await phishBlock.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});