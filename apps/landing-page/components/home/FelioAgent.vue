<template>
  <div class="w-full">
    <!-- Hero section -->
    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 xl:mx-20 my-0 shadow sm:rounded-2xl overflow-hidden"
    >
      <div class="w-full py-16 flex flex-col items-center">
        <div
          data-aos="fade-up"
          class="relative w-full flex flex-col lg:flex-row items-center justify-center space-y-12 lg:space-y-0 px-4 xl:px-10 mt-16 sm:mt-8"
        >
          <img
            data-aos="fade-up"
            data-aos-once="true"
            :src="require('~/assets/img/getting-started/sign-up.png')"
            class="-mt-4"
            alt=""
          />
        </div>
        <h2
          data-aos="flip-down"
          class="text-3xl sm:text-4xl font-semibold text-center"
        >
          Scale-Up With <span class="text-header-gradient">Confidence</span>
        </h2>
        <div
          data-aos="fade-up"
          data-aos-once="true"
          data-aos-delay="700"
          class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-2"
        >
          <BaseButton
            class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
          >
            Register Now !
          </BaseButton>
        </div>
      </div>
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
            Satu Portal Untuk Pendaftaran Agent
          </h2>
          <p class="paragraph">
            Pusing terima reseller masih manual ?. Dengan #FelioAgent, terima
            reseller makin efisien.
          </p>
          <p class="paragraph">
            Kamu cukup bikin halaman pendaftaran untuk resellermu, lalu share ke
            media social.
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
            Pantau Performa Reseller Di Satu Tempat
          </h2>
          <p class="paragraph">
            Dapatkan informasi performa resellermu secara real-time dan akurat.
          </p>
          <p class="paragraph">
            Dengan fitur ini, Kamu punya lebih banyak insight tentang bagaimana
            memaksimalkan tim resellermu
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
            Atur Level Agen Dan Reseller Sesuai Kebutuhan Bisnismu
          </h2>
          <p class="paragraph">
            Agar resellermu makin termotivasi untuk berjualan, Kamu perlu
            mengatur level agen dengan standar penjualan masing-masing.
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
            Atur Komisi Berdasarkan Produk dan Level Agen
          </h2>
          <p class="paragraph">
            Gak perlu lagi mengecek satu persatu transaksi tiap reseller untuk
            menghitung komisi reseller.
          </p>
          <p class="paragraph">
            #FelioAgent secara otomatis menghitung dan memisahkan komisi
            resellermu per-transaksi.
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
          <h2 class="text-4xl font-semibold">
            Lebih Dekat Dengan Tim Agen Dan Resellermu
          </h2>
          <div class="space-y-2" style="">
            <p class="paragraph text-sm xl:text-base">
              #FelioAgent menyediakan dedicated chat room biar Kamu dan tim
              resellermu bisa berdiskusi.
            </p>
            <p class="paragraph text-sm xl:text-base">
              Ada juga fitur untuk mencatat komplen dari pelanggan mereka biar
              kamu makin mudah menyelesaikannya.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeFelioAgent",
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
  background: url("../../assets/img/partner/background.png");
  background-size: cover;
  background-position: center;
}
.bg-trading-tools {
  background: url("../../assets/img/bg-trading-tools.webp");
  background-size: cover;
  background-position: center;
}
.max-h-0 {
  max-height: 0;
}
</style>
