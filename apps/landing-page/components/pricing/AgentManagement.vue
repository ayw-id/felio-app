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
                  <th
                    class="text-left lg:w-1/8 text-sm font-medium text-gray-500"
                  ></th>
                  <th class="text-left lg:w-1/4 text-sm text-gray-500">
                    <p
                      class="text-sm"
                      style="font-weight: 400; font-size: 16px"
                    >
                      Free
                    </p>
                    <p>
                      <span class="text-1xl">Rp.</span
                      ><span class="text-3xl">0 </span
                      ><span class="text-1xl"></span>
                    </p>
                  </th>
                  <th class="text-left lg:w-1/4 text-sm text-gray-500">
                    <p
                      class="text-sm"
                      style="font-weight: 400; font-size: 16px"
                    >
                      Basic
                    </p>
                    <p>
                      <span class="text-1xl">Rp.</span
                      ><span class="text-3xl">35K </span
                      ><span class="text-1xl">/Bln</span>
                    </p>
                  </th>
                  <th class="text-left lg:w-1/4 text-sm text-gray-500">
                    <p
                      class="text-sm"
                      style="font-weight: 400; font-size: 16px"
                    >
                      Free
                    </p>
                    <p>
                      <span class="text-1xl">Rp.</span
                      ><span class="text-3xl">225K </span
                      ><span class="text-1xl">/Bln</span>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in agentManagement"
                  :key="index"
                  class="border-b border-gray-200"
                >
                  <td
                    v-for="col in row"
                    :key="col"
                    class="py-4 whitespace-nowrap"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ col }}</span>
                    </div>
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
  name: "PricingAgentManagement",
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
      agentManagement: [
        ["Jumlah Maksimal Admin", "1", "5", "15"],
        ["Halaman Registrasi Agen", "✔", "✔", "✔"],
        ["Jumlah Maksimal Agen", "25", "100", "Unlimited"],
        ["Pengaturan Level Agen & Komisi", "✔", "✔", "✔"],
        ["Pantau Performa Agen", "✔", "✔", "✔"],
        ["Pengaturan Produk Agen", "✔", "✔", "✔"],
        ["Dedicated Chat Room", "✖", "✔", "✔"],
        ["Custom Features", "✖", "✖", "✔"],
      ],
    };
  },
};
</script>
