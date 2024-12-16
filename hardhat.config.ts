import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const priv_key = process.env.PRIVATE_KEY


const config: HardhatUserConfig = {

  solidity: {
    compilers: [
        {
            version: "0.8.27",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 100
                },
                viaIR: true,
            }
        }
    ]
  },
  defaultNetwork: "seiTestnet",
 networks:{
  hardhat: {

  },
  seiTestnet: {
    url: `https://evm-rpc-testnet.sei-apis.com`,  // Replace with SEI testnet RPC
    accounts: [`${priv_key}`],
    chainId: 1328,

    

    ignition: {
      maxFeePerGasLimit: 100_000_000_000n, // 60 gwei
      maxPriorityFeePerGas: 3_000_000_000n, // 3 gwei
      gasPrice: 100_000_000_000n,// 50 gwei
      disableFeeBumping: true,
    },
},

 },

 paths: {
  sources: "./contracts",
  tests: "./test",
  cache: "./cache",
  artifacts: "./artifacts"
},

ignition: {
  blockPollingInterval: 1_000,
  timeBeforeBumpingFees: 3 * 60 * 1_000,
  maxFeeBumps: 4,
  requiredConfirmations: 5,
  disableFeeBumping: false,
},

};

export default config;
