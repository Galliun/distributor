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
                {{ walletStatus=='connected' ?"disconnect" :"connect" }}
            </a>
            <br>
            <button v-if="mintStatus == 0 || mintPhase == 0" href="#" class="inline-flex items-center min-w-32 px-5 py-3 text-lg font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" disable>
                The mint is not open
            </button>
            <a v-if="mintStatus == 1 && mintPhase == 1" href="#" @click="ogMint" class="inline-flex items-center min-w-32 px-5 py-3 text-lg font-medium text-center text-white bg-yellow-700 rounded-lg hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                OG Mint
            </a>
            <a v-if="mintStatus == 1 && mintPhase == 2" href="#" @click="wlMint" class="inline-flex items-center min-w-32 px-5 py-3 text-lg font-medium text-center text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
                WL Mint
            </a>
            <a v-if="mintStatus == 1 && mintPhase == 3" href="#" @click="publicMint" class="inline-flex items-center min-w-32 px-5 py-3 text-lg font-medium text-center text-white bg-purple-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Public Mint
            </a>
            <br>
        </div>
    </div>
  </div>
</template>

<script>
import { ethosForVue, TransactionBlock } from 'ethos-connect-vue';
import Swal from 'sweetalert2';

const wlTicketType = "::orchestrator::WhitelistTicket";
const ogTicketType = "::orchestrator::OriginalGangsterTicket";

export const getTicketObjects = (packageId, type, jsonContent) => {
  return new Promise(async (resolve, reject) => {

    // find the object that has the type "published"
    function objectType(object) {
      return object.data.content.type == `${packageId}${type}`;
    };

    try {
      const ticketObjects = jsonContent?.filter(objectType);
        resolve(ticketObjects);
    } catch (error) {
      reject("Error", error);
    }
  });
};

export const getCoolerTickets = (ticketList, waterCoolerId) => {
  return new Promise(async (resolve, reject) => {

    // find the object that has the type "published"
    function objectType(object) {
      return object.data?.content?.fields?.waterCoolerId == waterCoolerId;
    };

    try {
      const ticketObjects = ticketList.filter(objectType);
        resolve(ticketObjects);
    } catch (error) {
      reject("Error", error);
    }
  });
};


export default {
  data() {
    return {
      packageId: "0x4f1868973f642f8960a3d2e564dcc500bd446a5d0421b64e7595f3fde88b3e48",
      waterCoolerId: "0x313d8b37a720baa56178198e3634785fdcbb25cba3cb1968462c2f7b562c714b",
      trasferPolicyId: "0x9e4d4eb145ac90fae9bf46d6c7210d282445c9b648461fe218f07a8ba55f04d6",
      factorySettingsId: "0xbe98bf94821688c817ffe48d7dfeb2b28baade88ed1a93ca34e617b6f26b276b",
      warehouseId: "0x483dc3d427a74426841a5ddc119a98cf6ba60baf8a1fcc1ca46dea654e8aff27",
      settingsId: "0x19624bce4c1ce4b4f2387623b072a9c748433543d143e748dc13472ab82ac55f",
      wallet: {},
      modal: {},
      walletStatus: "disconnect",
      mintPhase: 0,
      mintStatus: 0,
      mintPrice: 0,
      ogTickets: [],
      wlTickets: [],
    }
  },
  methods: {
    async connect () {
      if (!this.wallet) return;
      this.wallet.status=='connected' ? this.wallet.wallet.disconnect()  : this.modal.openModal();
    },
    async checkConnected() {
      if (!this.wallet) return;
      if(this.wallet.status=='connected') {
        this.walletStatus = "connected";
      } else {
        this.walletStatus = "disconnect";
      }
    },
    async updateMintSettings() {
      const settingsObject = await this.wallet?.wallet?.client?.getObject({
        id: this.settingsId,
        options: { showContent: true }
      });

      const settings = settingsObject?.data?.content?.fields;

      if(settings) {
        this.mintPhase = settings.phase;
        this.mintStatus = settings.status;
        this.mintPrice = parseInt(settings.price);
      }
    },
    async getTickets() {
      const ownedObjects = await this.wallet?.wallet?.client?.getOwnedObjects({
        owner: this.wallet?.wallet?.address,
        options: { showContent: true }
      });

      const ogTicketArray = await getTicketObjects(this.packageId, ogTicketType, ownedObjects?.data);
      const ogTicketList = await getCoolerTickets(ogTicketArray, this.waterCoolerId);
      
      const wlTicketArray = await getTicketObjects(this.packageId, wlTicketType, ownedObjects?.data);
      const wlTicketList = await getCoolerTickets(wlTicketArray, this.waterCoolerId);

      this.ogTickets = ogTicketList;
      this.wlTickets = wlTicketList;
    },
    async publicMint() {
      if (!this.wallet) return;
      if (this.wallet.status=='connected') {

        const txb = new TransactionBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(this.mintPrice)]);

        txb.moveCall({
            target: `${this.packageId}::orchestrator::public_mint`,
            arguments: [
                txb.object(this.waterCoolerId),
                txb.object(this.factorySettingsId),
                txb.object(this.warehouseId),
                txb.object(this.settingsId),
                txb.object(this.trasferPolicyId),
                coin
            ],
        });

        try {
          await this.wallet.wallet.signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showObjectChanges: true },
          });

          Swal.fire(
            'Public mint successful',
            'Congrats your NFT has been minted',
            'success'
          )

        } catch (error) {
          console.log("error", error);

          Swal.fire(
            'Error in Public mint',
            error,
            'error'
          )
        }   
      }
    },
    async ogMint() {
      if (!this.wallet) return;
      if (this.ogTickets.length == 0) {

        Swal.fire(
          'OG Mint',
          'You do not have any OG tickets',
          'info'
        )
        return;
      }
      if (this.wallet.status=='connected') {

        const txb = new TransactionBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(this.mintPrice)]);

        txb.moveCall({
            target: `${this.packageId}::orchestrator::og_mint`,
            arguments: [
                txb.object(this.ogTickets[0].data.objectId),
                txb.object(this.factorySettingsId),
                txb.object(this.waterCoolerId),
                txb.object(this.warehouseId),
                txb.object(this.settingsId),
                txb.object(this.trasferPolicyId),
                coin
            ],
        });

        try {
          await this.wallet.wallet.signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showObjectChanges: true },
          });

          this.ogTickets = this.ogTickets.shift();

          Swal.fire(
            'Public mint successful',
            'Congrats your NFT has been minted',
            'success'
          )

        } catch (error) {
          console.log("error", error);

          Swal.fire(
            'Error in OG mint',
            error,
            'error'
          )
        }   
      }
    },
    async wlMint() {
      if (!this.wallet) return;
      if (this.wlTickets.length == 0) {
        console.log("No WL tickets");
        Swal.fire(
          'White List Mint',
          'You do not have any White List tickets',
          'info'
        )
        return;
      }
      if (this.wallet.status=='connected') {

        const txb = new TransactionBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(this.mintPrice)]);

        txb.moveCall({
            target: `${this.packageId}::orchestrator::whitelist_mint`,
            arguments: [
                txb.object(this.wlTickets[0].data.objectId),
                txb.object(this.factorySettingsId),
                txb.object(this.waterCoolerId),
                txb.object(this.warehouseId),
                txb.object(this.settingsId),
                txb.object(this.trasferPolicyId),
                coin
            ],
        });

        try {
          await this.wallet.wallet.signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showObjectChanges: true },
          });

          this.wlTickets = this.wlTickets.shift();

          Swal.fire(
            'White List mint successful',
            'Congrats your NFT has been minted',
            'success'
          )

        } catch (error) {
          console.log("error", error);

          Swal.fire(
            'Error in WL mint',
            error,
            'error'
          )
        }   
      }
    },
  },
  async mounted() {
    const { context :{wallet, modal} } = ethosForVue() || {};

    this.wallet = wallet;
    this.modal = modal;

    await this.checkConnected();
    await this.updateMintSettings();
    await this.getTickets();
  }
}
</script>