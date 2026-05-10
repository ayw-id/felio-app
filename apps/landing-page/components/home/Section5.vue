<template>
  <section class="w-full my-24">
    <div
      class="relative max-w-screen-xl px-8 mx-auto grid grid-cols-12 gap-x-6"
    >
      <div data-aos="fade-right" class="col-span-12 lg:col-span-6">
        <div class="w-full">
          <img
            :src="require('~/assets/img/industry-leading-security.webp')"
            class="w-full"
            alt=""
          />
        </div>
      </div>
      <div
        data-aos="fade-left"
        class="col-span-12 lg:col-span-5 space-y-8 sm:space-y-6 mt-8 xl:px-8"
      >
        <h2 class="text-4xl font-semibold">
          <span class="text-gradient-agent">#FelioAgent</span>
        </h2>
        <ul class="space-y-8 sm:space-y-4">
          <LandingListItem title="Safety, security and compliance">
            <p class="text-sm text-gray-700 leading-relaxed">
              NEFA is a licensed New York trust company that undergoes regular
              bank exams and is subject to the cybersecurity audits conducted by
              the New York Department of Financial Services.
              <span class="underline">Learn more</span> about our commitment to
              security.
            </p>
          </LandingListItem>
          <LandingListItem title="Hardware security keys">
            <p class="text-sm text-gray-700 leading-relaxed">
              With NEFA you can secure your account with a hardware security key
              via WebAuthn.
            </p>
          </LandingListItem>
          <LandingListItem title="SOC Certifications">
            <p class="text-sm text-gray-700 leading-relaxed">
              NEFA is <span class="underline">SOC 1 Type 2</span> and
              <span class="underline">SOC 2 Type 2</span> compliant. We are the
              world’s first cryptocurrency exchange and custodian to complete
              these exams.
            </p>
          </LandingListItem>
        </ul>
      </div>
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
.text-gradient-agent {
  background: #9bafd9;
  background: linear-gradient(
    169.4deg,
    #9bafd9 -6.01%,
    #103783 36.87%,
    #1dbde6 78.04%,
    #432371 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
