import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import networks from "./networks";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: "0.8.9",
  gasReporter: {
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    currency: 'GBP',
    gasPrice: 120,
    coinmarketcap: process.env.COINMARKETCAP_KEY,
  },
  networks
};

export default config;
