//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //NO NEED TO HARDCODE THE PRICEFEED ADDRESS NOW!
        //ABI
        //Address - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );

        (, int price, , , ) = priceFeed.latestRoundData();
        //Price is Eth in terms of USD
        return uint256(price * 1e10);
    }

    // function getVersion() internal view returns (uint256) {
    //     AggregatorV3Interface pricefeed = AggregatorV3Interface(
    //         0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    //     );
    //     return pricefeed.version();
    // }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethprice = getPrice(priceFeed);
        uint256 ethAmountinUsd = (ethprice * ethAmount) / 1e18; //because each of ethprice and ethAmount has 18 zeros in decimals
        return ethAmountinUsd;
    }
}
