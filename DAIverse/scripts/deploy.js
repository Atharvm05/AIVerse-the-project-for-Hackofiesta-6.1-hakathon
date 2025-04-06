// Deployment script for DAIverse contracts
const hre = require("hardhat");

async function main() {
  console.log("Deploying DAIverse contracts...");

  // Deploy DAIToken
  const DAIToken = await hre.ethers.getContractFactory("DAIToken");
  const daiToken = await DAIToken.deploy();
  await daiToken.waitForDeployment();
  const daiTokenAddress = await daiToken.getAddress();
  console.log(`DAIToken deployed to: ${daiTokenAddress}`);

  // Deploy DAIBadge
  const DAIBadge = await hre.ethers.getContractFactory("DAIBadge");
  const daiBadge = await DAIBadge.deploy();
  await daiBadge.waitForDeployment();
  const daiBadgeAddress = await daiBadge.getAddress();
  console.log(`DAIBadge deployed to: ${daiBadgeAddress}`);

  // Deploy DAIModule with token and badge addresses
  const DAIModule = await hre.ethers.getContractFactory("DAIModule");
  const daiModule = await DAIModule.deploy(daiTokenAddress, daiBadgeAddress);
  await daiModule.waitForDeployment();
  const daiModuleAddress = await daiModule.getAddress();
  console.log(`DAIModule deployed to: ${daiModuleAddress}`);

  // Transfer ownership of token and badge contracts to module contract for integrated management
  console.log("Transferring ownership of token and badge contracts to module contract...");
  await daiToken.transferOwnership(daiModuleAddress);
  await daiBadge.transferOwnership(daiModuleAddress);
  console.log("Ownership transferred successfully");

  console.log("\nDeployment complete! Contract addresses:");
  console.log(`- DAIToken: ${daiTokenAddress}`);
  console.log(`- DAIBadge: ${daiBadgeAddress}`);
  console.log(`- DAIModule: ${daiModuleAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });