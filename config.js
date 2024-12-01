const ethers = require('ethers');

module.exports = {
  network: {
    name: 'Lisk L2',
    rpcUrl: process.env.LISK_RPC_URL || 'https://rpc.api.lisk.com',
    chainId: 1135,
    blockExplorer: 'https://blockscout.lisk.com'
  },
  
  contracts: {
    weth: {
      address: '0x4200000000000000000000000000000000000006',
      abi: [
        {
          "constant": false,
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {"name": "account", "type": "address"}
          ],
          "name": "balanceOf",
          "outputs": [{"name": "balance", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  },
  
  transaction: {
    minWrapAmount: ethers.parseUnits('0.000001', 18), 
    maxWrapAmount: ethers.parseUnits('10', 18), 
    
    maxGasPriceGwei: 50,
    gasLimit: 100000,
    
    maxRetryAttempts: 3,
    retryDelayMs: 5000
  },
  
  security: {
    whitelistedAddresses: [
    ],
    
    dailyWrapLimit: ethers.parseUnits('100', 18)
  },
  
  // Pengaturan Logging
  logging: {
    level: 'info',
    filePath: './logs/wrap-transactions.log',
    maxFiles: 5,
    maxSize: '10m'
  }
};