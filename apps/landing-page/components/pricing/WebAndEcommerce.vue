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
                      {{ $t("pricing.webBuilder.totalWebsite") }}
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
                      Premium
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
                <tr class="border-b border-gray-200">
                  <td class="py-4 whitespace-nowrap" colspan="4">
                    <h3 class="text-gray-500 text-3xl">Website Builder</h3>
                  </td>
                </tr>
                <tr
                  v-for="(row, index) in webBuilder"
                  :key="index"
                  class="border-b border-gray-200"
                >
                  <td
                    v-for="col in row"
                    :key="col"
                    class="py-4 whitespace-nowrap"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ $t(col) }}</span>
                    </div>
                  </td>
                </tr>

                <tr class="border-b border-gray-200">
                  <td class="py-4 whitespace-nowrap" colspan="4">
                    <h3 class="text-gray-500 text-3xl">E-Commerce</h3>
                  </td>
                </tr>
                <tr
                  v-for="(row, index) in eCommerce"
                  :key="index"
                  class="border-b border-gray-200"
                >
                  <td
                    v-for="col in row"
                    :key="col"
                    class="py-4 whitespace-nowrap"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ $t(col) }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const webBuilder = [
  ["pricing.webBuilder.totalWebsite", "10", "30", "pricing.general.unlimited"],
  [
    "pricing.webBuilder.template",
    "pricing.webBuilder.onlyFreeTemplate",
    "pricing.webBuilder.premiumTemplate",
    "pricing.webBuilder.premiumTemplate",
  ],
  ["pricing.webBuilder.storage", "500 MB", "3 GB", "35 GB"],
  ["pricing.webBuilder.bandwidth", "1 GB", "2 GB", "pricing.general.unlimited"],
  [
    "pricing.webBuilder.freeDomain",
    "pricing.webBuilder.subDomain",
    "pricing.webBuilder.dotCom1Year",
    "pricing.webBuilder.dotCom1Year",
  ],
  [
    "pricing.webBuilder.seo",
    "pricing.webBuilder.standardOptimization",
    "pricing.webBuilder.highOptimization",
    "pricing.webBuilder.fullOptimization",
  ],
  [
    "pricing.webBuilder.invFeature",
    "✔",
    "pricing.webBuilder.disTrxFee1",
    "pricing.webBuilder.disTrxFee2",
  ],
  ["pricing.webBuilder.socmedOpt", "✔", "✔", "✔"],
  ["pricing.webBuilder.removeFelio", "✖", "✔", "✔"],
  ["pricing.webBuilder.googleAnalytics", "✖", "✔", "✔"],
];
const eCommerce = [
  ["pricing.ecommerce.totalAdmin", "1", "5", "10"],
  ["pricing.ecommerce.productStock", "✔", "✔", "✔"],
  [
    "pricing.ecommerce.maxProduct",
    "50",
    "pricing.general.unlimited",
    "pricing.general.unlimited",
  ],
  ["pricing.ecommerce.variantProduct", "✔", "✔", "✔"],
  ["pricing.ecommerce.preOrder", "✖", "✖", "✔"],
  ["pricing.ecommerce.wholesale", "✖", "✔", "✔"],
  ["pricing.ecommerce.bundleProduct", "✖", "✔", "✔"],
  ["pricing.ecommerce.specialCategory", "✔", "✔", "✔"],
  ["pricing.ecommerce.discountFeature", "✔", "✔", "✔"],
  ["pricing.ecommerce.promoCode", "✖", "✔", "✔"],
  ["pricing.ecommerce.flashSale", "✖", "✖", "✔"],
  [
    "pricing.ecommerce.paymentMethod",
    "✔",
    "pricing.ecommerce.disTrxFee1",
    "pricing.ecommerce.disTrxFee2",
  ],
  [
    "pricing.ecommerce.notification",
    "pricing.ecommerce.pushNotif",
    "pricing.ecommerce.pushNotifEmail",
    "pricing.ecommerce.pushNotifEmailSMS",
  ],
  ["pricing.ecommerce.affiliate", "✖", "✔", "✔"],
  ["pricing.ecommerce.report", "✔", "✔", "✔"],
];
</script>
