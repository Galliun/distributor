<script setup >
import { ethosForVue, TransactionBlock } from 'ethos-connect-vue';

const { context :{wallet, modal} } = ethosForVue() || {};

const packageId = "0xa401bdf6783c4409ce79f731576a2a3a6d9276e6005c8f73555e54ea56014c01";
const waterCoolerId = "0x5cad685144ec87a966f2cc888a873ee7a75e41a71f97629a7abedf2bde2b08e9";
const mintwarehouseId = "0xf37e73983f5aee4abbbfa07275fc149f116949f7b77e9d7b2405f31c6746d5e4";
const mintsettingsId = "0x0d465c1220e90a4f4d409b186ade2e89e03c8a14bf5fadeb579990c8ffbd43f5";
const mintPrice = 1000000;

const connect = () => {
  if (!wallet) return;
  wallet.status=='connected' ? wallet.wallet.disconnect()  : modal.openModal();
  
}

const mint = async () => {
  if (!wallet) return;
  if (wallet.status=='connected') {

    const txb = new TransactionBlock();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure(mintPrice)]);

    console.log("Admin calls public_mint_test");

    txb.moveCall({
        target: `${packageId}::mint::public_mint_test`,
        arguments: [
            txb.object(waterCoolerId),
            txb.object(mintwarehouseId),
            txb.object(mintsettingsId),
            coin
        ],
    });

    try {
      const objectChange = await wallet.wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: { showObjectChanges: true },
      });

      console.log("objectChange", objectChange);
    } catch (error) {
      console.log("error", error);
    }
        
  }
}
</script>

<template>
  <div class="flex flex-row min-h-screen justify-center items-center">
    <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <img class="rounded-t-lg w-81" src="/logo.png" alt="" />
        </a>
        <div class="p-5 justify-center items-center text-center">
            <a href="#">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Galliun NFT Distributor
                </h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Mint an NFT using Galliun Water Cooler
            </p>
            <a href="#" @click="connect" class="inline-flex justify-center capitalize min-w-32 items-center px-5 mb-3 py-3 text-lg font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                {{ wallet.status=='connected' ?"disconnect" :"connect" }}
            </a>
            <br>
            <a  href="#" @click="mint" class="inline-flex items-center  min-w-32 px-5 py-3 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Mint NFT
            </a>
            <br>
        </div>
    </div>
  </div>
</template>
