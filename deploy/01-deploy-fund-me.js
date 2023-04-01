//import
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()
//main function
//calling the main function

// function deployfunc() {
//     console.log("Hello world!")
//     hre.getNamedAccounts
//     hre.deployments
// }

// module.exports.default = deployfunc

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log("------------------------------------------------------")

    //What happens when we want to use a different chain ?
    const args_updated = [ethUsdPriceFeedAddress]
    const fundme = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args_updated,
        waitConfirmations: network.config.blockConfirmations || 1, //put priceFeed addresses here
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify the contract
        await verify(fundme.address, args_updated)
    }
}

module.exports.tags = ["all", "fundme"]
