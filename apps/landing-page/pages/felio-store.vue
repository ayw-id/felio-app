<template>
  <div class="w-full">
    <!-- Hero section -->
    <section id="hero" class="w-full pb-24">
      <BaseSection>
        <div
          class="col-span-12 lg:col-span-6 mt-12 xl:mt-10 space-y-4 sm:space-y-6 px-6 text-center sm:text-left"
        >
          <h1
            data-aos="fade-right"
            data-aos-once="true"
            class="text-[2.5rem] sm:text-5xl xl:text-6xl font-bold leading-tight capitalize sm:pr-8 xl:pr-10"
          >
            Maximize Your Sales With
            <span class="text-header-gradient">Powerfull Online Store</span>
          </h1>
          <!-- <p data-aos="fade-down" data-aos-once="true" data-aos-delay="300" class="paragraph hidden sm:block">
            Buy and sell 200+ cryptocurrencies with 20+ flat currencies using bank transfers or your credit/debit card.
          </p> -->
          <div
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-delay="700"
            class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-2"
          >
            <BaseButton
              class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
            >
              Build Your Website Now !
            </BaseButton>
          </div>
        </div>
        <div class="hidden sm:block col-span-12 lg:col-span-6">
          <div class="w-full">
            <img
              data-aos="fade-up"
              data-aos-once="true"
              :src="require('~/assets/img/hero-image.webp')"
              class="-mt-4"
              alt=""
            />
          </div>
        </div>
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-1.png')"
          class="hidden sm:block absolute bottom-12 xl:bottom-16 left-4 xl:left-0 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-2.png')"
          class="hidden sm:block absolute top-4 sm:top-10 right-64 sm:right-96 xl:right-[32rem] w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-3.png')"
          class="hidden sm:block absolute bottom-56 right-24 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/star.png')"
          class="hidden sm:block absolute top-20 sm:top-28 right-16 lg:right-0 lg:left-[30rem] w-8"
        />
      </BaseSection>
    </section>

    <!-- Credit card section -->
    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">Kelola Bisnis Lebih Efisien</h2>
          <p class="paragraph">
            Pengaturan stok dan varian produk di satu tempat, bikin kerjaanmu
            makin simpel dan cepat
          </p>
        </div>
      </BaseSection>
    </section>

    <!-- Advanced trading tools section -->
    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">Branding Lebih Profesional</h2>
          <p class="paragraph">
            Buat pelangganmu makin betah berbelanja dengan jasa pengiriman dan
            metode pembayaran yang mereka inginkan.
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <!-- Credit card section -->
    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-right" class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            Cara Yang Tepat Promosikan Produk
          </h2>
          <p class="paragraph">
            Diskon, promo code, special categories, hingga iklan bisa kamu
            gunakan untuk menarik pembeli untuk berbelanja di tokomu.
          </p>
        </div>
      </BaseSection>
    </section>

    <!-- Advanced trading tools section -->
    <section class="w-full my-36">
      <BaseSection style="align-items: center">
        <div data-aos="fade-left" class="col-span-12 lg:col-span-7 sm:hidden">
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20"
        >
          <h2 class="text-4xl font-semibold">
            Jangkau Lebih Banyak Calon Pembeli
          </h2>
          <p class="paragraph">
            Bangun tim resellermu biar penjualanmu makin maksimal. Cukup
            aktifkan fitur #FelioAgent, dan mulai kelola tim resellermu dengan
            mudah dan efisien
          </p>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-7 hidden sm:block"
        >
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
      </BaseSection>
    </section>

    <!-- Advanced trading tools section -->
    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 my-20 py-16 shadow rounded-2xl overflow-hidden"
    >
      <div
        class="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6"
        style="align-items: center"
      >
        <LandingTradingToolImage data-aos="fade-right" />
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8"
        >
          <h2 class="text-4xl font-semibold">Lebih Dekat Dengan Pelangganmu</h2>
          <div class="space-y-2" style="">
            <p class="paragraph text-sm xl:text-base">
              Pantau traffic dan data pelangganmu untuk mengetahui apa yang
              mereka mau.
            </p>
            <p class="paragraph text-sm xl:text-base">
              Aktifkan juga fitur facebook pixel untuk memantau performa
              iklanmu.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="w-full my-10 flex justify-center">
      <NuxtLink
        href="#navbar"
        data-aos="flip-down"
        data-aos-delay="150"
        class="px-6 py-3 flex items-center space-x-2 bg-[#FAFAFA] hover:bg-gray-100 hover:shadow-md border border-[#DDDDDD] rounded-md text-gray-700"
        @click="scrollTo('#navbar')"
      >
        <span>Back to top</span>
        <MdiIcon :size="20" icon="mdiArrowUp" />
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "FelioSitePage",
  data() {
    return {
      selected: 0,
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
      trendings: [
        {
          id: 1,
          name: "Bitcoin",
          price: 43180.13,
          logo: "bitcoin.png",
          increase: true,
          data: [40, 35, 60, 75, 60, 75, 50],
        },
        {
          id: 2,
          name: "Ethereum",
          price: 3480.65,
          logo: "ethereum.png",
          increase: false,
          data: [25, 30, 60, 50, 80, 55, 80],
        },
        {
          id: 3,
          name: "Solana",
          price: 150.2,
          logo: "solana.png",
          increase: true,
          data: [40, 45, 40, 80, 50, 60, 35],
        },
        {
          id: 4,
          name: "Dogecoin",
          price: 0.1572,
          logo: "dogecoin.png",
          increase: true,
          data: [35, 70, 60, 80, 50, 60, 40],
        },
      ],
      topGainers: [
        {
          id: 1,
          name: "PAPPAY",
          price: 0.00374,
          logo: "pappay.png",
          increase: true,
          data: [30, 50, 45, 60, 70, 40, 45],
        },
        {
          id: 2,
          name: "Bitcoin Asia",
          price: 0.02096,
          logo: "bitcoin-asia.png",
          increase: true,
          data: [25, 60, 50, 60, 35, 50, 70],
        },
        {
          id: 3,
          name: "MoonRock",
          price: 0.004907,
          logo: "moonrock.png",
          increase: true,
          data: [40, 35, 40, 25, 50, 70, 45],
        },
        {
          id: 4,
          name: "NinjaFloki",
          price: 0.000123,
          logo: "ninjafloki.png",
          increase: true,
          data: [45, 35, 40, 30, 25, 45, 35],
        },
      ],
      recents: [
        {
          id: 1,
          name: "MetaCraft",
          price: 0.0608,
          logo: "metacraft.png",
          increase: false,
          data: [40, 50, 45, 60, 35, 40, 45],
        },
        {
          id: 2,
          name: "Frog",
          price: 0.5875,
          logo: "frog.png",
          increase: false,
          data: [25, 50, 45, 48, 40, 60, 45],
        },
        {
          id: 3,
          name: "Musk Doge",
          price: 0.04041,
          logo: "musk-doge.png",
          increase: true,
          data: [25, 35, 60, 45, 50, 45, 45],
        },
        {
          id: 4,
          name: "2SHARE",
          price: 1366.24,
          logo: "2share.png",
          increase: true,
          data: [35, 30, 60, 50, 35, 45, 40],
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
