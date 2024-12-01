const { ethers } = require('ethers');
const readline = require('readline');
const crypto = require('crypto');

function displayTitle() {
    const title = `

    ░░░░░██╗░█████╗░███╗░░░███╗░█████╗░██╗░░██╗  ███████╗███╗░░░███╗██████╗░██✓██████╗░███████╗
    ░░░░░██║██╔══██╗████╗░████║██╔══██╗██║░██╔╝  ██╔════╝████╗░████║██╔══██╗██║██╔══██╗██╔════╝
    ░░░░░██║██║░░██║██╔████╔██║██║░░██║█████═╝░  █████╗░░██╔████╔██║██████╔╝██║██████╔╝█████╗░░
    ██╗░░██║██║░░██║██║╚██╔╝██║██║░░██║██╔═██╗░  ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║██╔══██╗██╔══╝░░
    ╚█████╔╝╚█████╔╝██║░╚═╝░██║╚█████╔╝██║░╚██╗  ███████╗██║░╚═╝░██║██║░░░░░██║██║░░██║███████╗
    ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚═╝  ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚══════╝       
    
    
    🌐 By Jomok Empire : https://t.me/jomokempire 🌐 
    
    `;
    console.log('\x1b[36m%s\x1b[0m', title); 
}

// Konfigurasi Lisk L2
const LISK_RPC_URL = 'https://rpc.api.lisk.com';
const LISK_CHAIN_ID = 1135;
const WETH_CONTRACT = '0x4200000000000000000000000000000000000006';

// Konstanta gas fee (dalam GWEI)
const GAS_SETTINGS = {
    BASE_FEE: 0.0000010,        // Base fee
    MAX_FEE: 0.0000015,          // Max fee
    MAX_PRIORITY_FEE: 0.0000011     // Max priority fee
};

// Fungsi untuk menghasilkan jumlah wrap acak 
function generateRandomWrapAmount() {
    const min = 0.0000001;
    const max = 0.000005;
    const u = Math.random();
    const randomAmount = min * Math.pow(max/min, u);
    return randomAmount.toFixed(8);
}

// Fungsi untuk membuat delay 
function naturalDelay(min, max) {
    const u = Math.random();
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logDelay = logMin + u * (logMax - logMin);
    return Math.exp(logDelay) * 1000; 
}

// Fungsi validasi private key
function validatePrivateKey(privateKey) {
    try {
        if (!/^(0x)?[0-9a-fA-F]{64}$/.test(privateKey)) {
            return false;
        }
        const wallet = new ethers.Wallet(privateKey);
        return true;
    } catch (error) {
        return false;
    }
}

// Fungsi input tersembunyi
function securePrivateKeyInput(rl) {
    return new Promise((resolve) => {
        rl.question('🔐 Masukkan Private Key Wallet: ', {
            hideEchoBack: true,
            mask: '*'
        }, (privateKey) => {
            const hashedKey = crypto.createHash('sha256').update(privateKey.trim()).digest('hex');
            resolve({
                key: privateKey.trim(),
                hash: hashedKey
            });
        });
    });
}

// Fungsi wrap ETH
async function wrapEthTransaction() {
    displayTitle();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        securePrivateKeyInput(rl).then(async (privateKeyData) => {
            if (!validatePrivateKey(privateKeyData.key)) {
                console.error('❌ Private Key tidak valid! Pastikan format benar.');
                rl.close();
                return reject(new Error('Invalid Private Key'));
            }

            rl.question('📊 Masukkan Jumlah Transaksi: ', async (jumlahTransaksi) => {
                const numTransaksi = parseInt(jumlahTransaksi);
                
                if (isNaN(numTransaksi) || numTransaksi <= 0) {
                    console.error('❌ Jumlah transaksi harus angka positif!');
                    rl.close();
                    return reject(new Error('Invalid Transaksi Amount'));
                }

                try {
                    const provider = new ethers.JsonRpcProvider(LISK_RPC_URL, {
                        name: 'Lisk',
                        chainId: LISK_CHAIN_ID
                    });
                    
                    const wallet = new ethers.Wallet(privateKeyData.key, provider);

                    const wethContract = new ethers.Contract(
                        WETH_CONTRACT, 
                        [
                            'function deposit() public payable',
                            'function balanceOf(address) public view returns (uint256)'
                        ],
                        wallet
                    );

                    console.log(`
                    🌐 Jaringan: Lisk L2
                    👤 Wallet: ${wallet.address}
                    🔁 Jumlah Transaksi: ${numTransaksi}
                    💸 Gas Settings:
                      - Base Fee: ${GAS_SETTINGS.BASE_FEE} GWEI
                      - Max Fee: ${GAS_SETTINGS.MAX_FEE} GWEI
                      - Max Priority Fee: ${GAS_SETTINGS.MAX_PRIORITY_FEE} GWEI
                    `);

                    rl.question('✅ Apakah Anda yakin ingin melanjutkan? (y/n): ', async (konfirmasi) => {
                        if (konfirmasi.toLowerCase() !== 'y') {
                            console.log('🚫 Transaksi dibatalkan.');
                            rl.close();
                            return reject(new Error('Transaksi Dibatalkan'));
                        }

                        try {
                            let saldo = await provider.getBalance(wallet.address);
                            
                            for (let i = 0; i < numTransaksi; i++) {
                                const randomWrapAmount = generateRandomWrapAmount();

                                const wrapValueWei = ethers.parseEther(randomWrapAmount.toString());
                                
                                if (saldo < wrapValueWei) {
                                    console.error(`❌ Saldo tidak mencukupi untuk wrap ke-${i + 1}`);
                                    break;
                                }

                                // Konversi gas settings ke wei
                                const maxFeePerGas = ethers.parseUnits(Number(GAS_SETTINGS.MAX_FEE).toFixed(9).toString(), 'gwei');
                                const maxPriorityFeePerGas = ethers.parseUnits(Number(GAS_SETTINGS.MAX_PRIORITY_FEE).toFixed(9).toString(), 'gwei');

                                const tx = await wethContract.deposit({
                                    value: wrapValueWei,
                                    maxFeePerGas: maxFeePerGas,
                                    maxPriorityFeePerGas: maxPriorityFeePerGas,
                                    gasLimit: 100000 
                                });

                                const receipt = await tx.wait();
                                
                                console.log(`
                                  [${i + 1}/${numTransaksi}] 
                                  Hash: https://blockscout.lisk.com/tx/${tx.hash}
                                  Wrap Amount: ${randomWrapAmount} ETH
                                  Consumed Fee: ${ethers.formatEther(receipt.gasUsed * receipt.gasPrice)} ETH
                                  `);

                                saldo -= wrapValueWei;

                                if (i < numTransaksi - 1) {
                                    const cooldown = naturalDelay(30, 180);
                                    console.log(`⏳ Menunggu ${Math.round(cooldown/1000)} detik...`);
                                    await new Promise(resolve => setTimeout(resolve, cooldown));
                                }
                            }

                            console.log('✅ Semua Transaksi Wrap Selesai 🎉');
                            rl.close();
                            resolve();
                        } catch (error) {
                            console.error('❌ Gagal melakukan wrap:', error);
                            rl.close();
                            reject(error);
                        }
                    });
                } catch (error) {
                    console.error('❌ Terjadi kesalahan:', error);
                    rl.close();
                    reject(error);
                }
            });
        });
    });
}

wrapEthTransaction()
    .then(() => {
        console.log('🏁 Proses selesai.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });