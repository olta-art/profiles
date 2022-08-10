import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: "0.8.9",
  gasReporter: {
    currency: 'GBP',
    gasPrice: 120,
    coinmarketcap: process.env.COINMARKETCAP_KEY,
  },
};

export default config;
