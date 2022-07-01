const networkConfig = {
  4: {
    name: "rinkeby",
    applePriceFeed: "0x3539F2E214d8BC7E611056383323aC6D1b01943c", //this is actually ATOM/USD price feed
    teslaPriceFeed: "0x031dB56e01f82f20803059331DC6bEe9b17F7fC9", //BAT/USD price feed
    microsoftPriceFeed: "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623", //LINK/USD price feed
    facebookPriceFeed: "0x7794ee502922e2b723432DDD852B3C30A911F021", //MATIC/USD price feed
    twitterPriceFeed: "0xb29f616a0d54FF292e997922fFf46012a63E2FAe", //TRX/USD price feed
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
