<template>
  <div class="w-full flex flex-col lg:flex-row items-center justify-center">
    <div class="w-full mt-6 lg:mt-0 overflow-hidden space-y-6 lg:px-8">
      <!-- <div class="w-full flex items-center justify-between">
        <span class="font-medium">title</span>
        <button
          href="#"
          class="px-3 py-1 text-sm font-medium text-blue-500 flex items-center
            space-x-1 rounded-md hover:bg-blue-50 transition duration-300"
        >
          <span>More</span>
          <ChevronRightIcon :size="16" />
        </button>
      </div> -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="px-2 sm:px-6 py-2 align-middle inline-block min-w-full overflow-hidden"
          >
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="text-left lg:w-2/5 text-sm text-gray-500 text-2xl">
                    Metode Pembayaran
                  </th>
                  <th class="text-left lg:w-3/5 text-sm text-gray-500 text-2xl">
                    Biaya Transaksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in transactionFee"
                  :key="index"
                  class="border-b border-gray-200"
                >
                  <td v-for="col in row" :key="col" class="py-4">
                    <p :style="`${col.subTitle ? 'font-weight: bold;' : ''}`">
                      {{ col.title }}
                    </p>
                    <p v-if="col.subTitle" class="text-sm font-medium">
                      {{ col.subTitle }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- <LandingCryptoStatistic
      title="🔥 Trending"
      :datasets="trendings"
      class="xl:border-r border-gray-200 lg:px-8"
    />
    <LandingCryptoStatistic
      title="🚀 Top Gainers"
      :datasets="topGainers"
      class="xl:border-r border-gray-200 lg:px-8"
    />
    <LandingCryptoStatistic
      title="💎 Recently Added"
      :datasets="recents"
      class="lg:px-8"
    /> -->
  </div>
</template>
<script>
export default {
  name: "PricingTransactionFee",
  props: {
    title: {
      type: String,
      default: "",
    },
    datasets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      transactionFee: [
        [
          {
            title: "Virtual Account",
            subTitle: "(BRI, BNI, Mandiri, Permata)",
          },
          {
            title: "(1% + Rp. 4,000) per transaksi",
          },
        ],
        [
          {
            title: "Retail Outlet",
            subTitle: "(Alfamart)",
          },
          {
            title: "Rp. 5,000 per transaksi",
          },
        ],
        [
          {
            title: "E-Wallet",
            subTitle: "(Ovo, Dana, ShopeePay, LinkAja)",
          },
          {
            title: "3% per transaksi",
          },
        ],
      ],
    };
  },
};
</script>
