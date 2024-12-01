# Lisk Wrap Transactions

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/natashyaroo/Lisk-Wrap.git
   ```
2. Navigate to the project directory:
   ```
   cd Lisk-Wrap
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Run the script:
   ```
   node index.js
   ```
2. When prompted, enter your private key.
3. Enter the number of transactions you want to perform.
4. Review the transaction details and confirm to proceed.

The script will execute the specified number of WETH wrap transactions with the following configurable settings:

- **Wrap Amount**: Randomized between 0.0000001 and 0.000005 ETH
- **Gas Settings**:
  - Base Fee: 0.0000010 GWEI
  - Max Fee: 0.0000015 GWEI
  - Max Priority Fee: 0.0000011 GWEI

The script will output the transaction hash, wrap amount, and consumed fee for each successful transaction.

## Configuration

You can customize the following parameters in the `config.js` file:

- `transaction.minWrapAmount`: Minimum wrap amount (default: 0.0000001 ETH)
- `transaction.maxWrapAmount`: Maximum wrap amount (default: 0.000005 ETH)
- `transaction.maxGasPriceGwei`: Maximum gas price (default: 0.0000015 GWEI)
