<template>
  <section
    class="bg-trading-tools relative max-w-full sm:mx-4 my-20 py-16 shadow rounded-2xl overflow-hidden"
  >
    <div
      class="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6"
    >
      <LandingTradingToolImage class="sm:hidden" />
      <div
        data-aos="fade-right"
        class="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8"
      >
        <h2 class="text-4xl font-semibold">
          <span class="text-gradient-store">#FelioStore</span>
        </h2>
        <div class="space-y-2">
          <h4 class="text-lg font-medium">
            Professional Access, Non-stop Availability
          </h4>
          <p class="paragraph text-sm xl:text-base">
            We provide premium access to crypto trading for both individuals and
            institutions through high liquidity, reliable order execution and
            constant uptime.
          </p>
        </div>
        <div class="space-y-2">
          <h4 class="text-lg font-medium">A Range of Powerful Apis</h4>
          <p class="paragraph text-sm xl:text-base">
            Set up your own trading interface or deploy your algorithmic
            strategy with our high-performance FIX and HTTP APIs. Connect to our
            WebSocket for real-time data streaming.
          </p>
        </div>
        <div class="space-y-2">
          <h4 class="text-lg font-medium">Customer Support</h4>
          <p class="paragraph text-sm xl:text-base">
            Premium 24/7 support available to all customers worldwide by phone
            or email. Dedicated account managers for partners.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row">
          <BaseButton
            class="px-10 py-4 bg-inherit text-gradient border border-[#4A8FF6] text-base"
          >
            Get Started
          </BaseButton>
          <BaseButton
            class="bg-inherit text-[#4A8FF6] px-10 py-4 text-center underline rounded-full"
          >
            Learn More
          </BaseButton>
        </div>
      </div>
      <LandingTradingToolImage data-aos="fade-left" class="hidden sm:block" />
    </div>
  </section>
</template>
<script>
export default {
  name: "HomeSection5",
  props: {},
};
</script>
<style scoped>
.text-gradient-store {
  background: #00ff87;
  background: linear-gradient(
    169.4deg,
    #00ff87 -6.01%,
    #ff0f7b 36.87%,
    #ff930f 78.04%,
    #fff95b 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
