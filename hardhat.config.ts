import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotConfig } from "dotenv";

dotConfig();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        count: 20,
      },
    },
    matic: {
      url: process.env.MATIC_URL || "",
      accounts:
        process.env.MATIC_OWNER_KEY !== undefined
          ? [process.env.MATIC_OWNER_KEY]
          : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts:
        process.env.MUMBAI_OWNER_KEY !== undefined
          ? [process.env.MUMBAI_OWNER_KEY]
          : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
