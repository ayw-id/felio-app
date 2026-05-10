<template>
  <div class="w-full">
    <!-- Hero section -->
    <section id="hero" class="w-full pb-24 lg:pt-32 sm:pt-32">
      <BaseSection>
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-1.png"
          class="hidden sm:block absolute bottom-12 xl:bottom-16 left-4 xl:left-0 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-2.png"
          class="hidden sm:block absolute top-4 sm:top-10 right-64 sm:right-96 xl:right-[32rem] w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/ellipse-3.png"
          class="hidden sm:block absolute bottom-56 right-24 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          src="~/assets/img/pattern/star.png"
          class="hidden sm:block absolute top-20 sm:top-28 right-16 lg:right-0 lg:left-[30rem] w-8"
        />
      </BaseSection>
    </section>

    <!-- Crypto statistic section -->
    <section
      class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
    >
      <div
        class="flex flex-col sm:flex-row space-y-2 justify-center sm:space-y-0 sm:space-x-4 mt-2 mb-8"
      >
        <BaseButton
          :class="
            pricingSection === 'webBuilder'
              ? 'max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white'
              : 'max-w-full px-8 py-4 text-gradient border border-[#0c66ee]'
          "
          @click="pricingSection = 'webBuilder'"
          >Website & E-commerce
        </BaseButton>
        <BaseButton
          :class="
            pricingSection === 'agentManagement'
              ? 'max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white'
              : 'max-w-full px-8 py-4 text-gradient border border-[#0c66ee]'
          "
          @click="pricingSection = 'agentManagement'"
          >Agen & Reseller Management
        </BaseButton>
        <BaseButton
          :class="
            pricingSection === 'transactionFee'
              ? 'max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white'
              : 'max-w-full px-8 py-4 text-gradient border border-[#0c66ee]'
          "
          @click="pricingSection = 'transactionFee'"
          >Biaya Transaksi
        </BaseButton>
      </div>
      <PricingWebAndEcommerce v-if="pricingSection === 'webBuilder'" />
      <PricingAgentManagement v-if="pricingSection === 'agentManagement'" />
      <PricingTransactionFee v-if="pricingSection === 'transactionFee'" />
    </section>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      selected: 0,
      pricingSection: "webBuilder",
      dropdownConcurency: false,
      dropdownCrypto: false,
      currencySelected: {
        img: "country-icon/eng.png",
        name: "USD",
      },
      currencies: [
        {
          img: "country-icon/eng.png",
          name: "USD",
        },
      ],
      cryptoSelected: {
        img: "crypto-icon/bitcoin.png",
        name: "BTC",
      },
      cryptocurrencies: [
        {
          img: "crypto-icon/bitcoin.png",
          name: "BTC",
        },
      ],
      accordions: [
        {
          title: "Why should I choose NEFA?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over 8 million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "How secure is NEFA?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "Do I have to buy a whole Bitcoin?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "How do I actually buy Bitcoin?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
      ],
      steps: [
        {
          img: "sign-up.png",
          title: "Sign Up",
          description:
            "Sign up for your free NEFA Wallet on web, iOS or Android and follow our easy process to set up your profile",
        },
        {
          img: "fund.png",
          title: "Fund",
          description:
            "Choose your preferred payment method such as bank transfer or credit card to top up your NEFA Wallet",
        },
        {
          img: "buy-crypto.png",
          title: "Buy Crypto",
          description:
            "Buy Bitcoin or Ethereum, then securely store it in your Wallet or send it on easily to your friends anywhere",
        },
      ],
    };
  },
  mounted() {
    const localeCode = localStorage.getItem("LOCALE-CODE");
    if (localeCode && localeCode !== this.$i18n.locale) {
      this.$i18n.setLocale(localeCode);
    }
  },
};
</script>
<style scoped>
.text-header-gradient {
  background: rgb(57, 132, 244);
  background: linear-gradient(
    169.4deg,
    #3984f4 -6.01%,
    #0cd3ff 36.87%,
    #2f7cf0 78.04%,
    #0e65e8 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-partner {
  background: url("../assets/img/partner/background.png");
  background-size: cover;
  background-position: center;
}
.bg-trading-tools {
  background: url("../assets/img/bg-trading-tools.webp");
  background-size: cover;
  background-position: center;
}
.max-h-0 {
  max-height: 0;
}
</style>
