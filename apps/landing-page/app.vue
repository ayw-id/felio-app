<template>
  <div class="min-h-screen font-sans antialiased relative">
    <div class="relative">
      <div
        :class="`absolute top-0 left-0 w-full h-[125vh] sm:h-[225vh] lg:h-[125vh] ${getClassByPath}`"
      ></div>
      <BaseNavbar />

      <main class="text-neutral-800">
        <NuxtPage />
      </main>

      <HomeSubscribeNewsLetter
        v-if="showNewsletter"
        @submit="handleNewsletterSubmit"
        @close="handleNewsletterFormClose"
      />

      <BaseFooter @showNewsletter="handleShowNewsletter" />
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const getClassByPath = computed(() => {
  const path = route.path;
  let prefix = "";
  if (path === "/felio-site") {
    prefix = "felio-site-";
  } else if (path === "/felio-store") {
    prefix = "felio-store-";
  } else if (path === "/felio-agent") {
    prefix = "felio-agent-";
  }
  return `${prefix}cover-gradient-2 sm:${prefix}cover-gradient`;
});

// Local Storage Keys
const NEWSLETTER_DATA_KEY = "newsletter_data"; // Stores { name, email, company }
const LAST_CLOSED_KEY = "popup_last_closed";
const POPUP_DELAY = 10 * 60 * 1000; // 10 minutes
const INITIAL_POPUP_DELAY = 5 * 1000; // 5 seconds

const showNewsletter = ref<boolean>(false);

onMounted(() => {
  const newsletterData = localStorage.getItem(NEWSLETTER_DATA_KEY);
  if (!newsletterData) {
    setTimeout(() => {
      if (route.path !== "/waiting-list") {
        showNewsletter.value = true;
      }
    }, INITIAL_POPUP_DELAY);
  }
});

// Handle Newsletter Form Close (wait 10 min)
const handleNewsletterFormClose = (): void => {
  localStorage.setItem(LAST_CLOSED_KEY, Date.now().toString());
  showNewsletter.value = false;
  setTimeout(() => {
    if (route.path !== "/waiting-list") {
      showNewsletter.value = true;
    }
  }, POPUP_DELAY);
};

// Handle Newsletter Form Submission
const handleNewsletterSubmit = (formData: {
  name: string;
  email: string;
}): void => {
  localStorage.setItem(NEWSLETTER_DATA_KEY, JSON.stringify(formData));
  showNewsletter.value = false;
};

const handleShowNewsletter = (): void => {
  showNewsletter.value = true;
};
</script>

<style>
.cover-gradient-navbar {
  /* background: linear-gradient(
    169.4deg,
    rgba(231, 111, 81, 0.2) -6.01%,
    rgba(175, 244, 97, 0.2) 36.87%,
    rgba(15, 232, 156, 0.2) 78.04%,
    rgba(65, 14, 232, 0.2) 103.77%
  ); */
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(0.625rem);
}
.cover-gradient {
  background: linear-gradient(
    169.4deg,
    rgba(57, 132, 244, 0.04) -6.01%,
    rgba(12, 211, 255, 0.04) 36.87%,
    rgba(47, 124, 240, 0.04) 78.04%,
    rgba(14, 101, 232, 0.04) 103.77%
  );
}
.cover-gradient-2 {
  background: linear-gradient(
    169.4deg,
    #e76f511a -6.01%,
    #aff4611a 36.87%,
    #0fe89c1a 78.04%,
    #410ee81a 103.77%
  );
}
.felio-site-cover-gradient {
  background: linear-gradient(
    169.4deg,
    rgba(57, 132, 244, 0.04) -6.01%,
    rgba(12, 211, 255, 0.04) 36.87%,
    rgba(47, 124, 240, 0.04) 78.04%,
    rgba(14, 101, 232, 0.04) 103.77%
  );
}
.felio-site-cover-gradient-2 {
  background: linear-gradient(
    169.4deg,
    #632e821a -6.01%,
    #581a7c1a 36.87%,
    #5019e61a 78.04%,
    #320aa11a 103.77%
  );
}
.felio-store-cover-gradient {
  background: linear-gradient(
    169.4deg,
    rgba(57, 132, 244, 0.04) -6.01%,
    rgba(12, 211, 255, 0.04) 36.87%,
    rgba(47, 124, 240, 0.04) 78.04%,
    rgba(14, 101, 232, 0.04) 103.77%
  );
}
.felio-store-cover-gradient-2 {
  background: linear-gradient(
    169.4deg,
    #51a1e71a -6.01%,
    #155f9f1a 36.87%,
    #15239f1a 78.04%,
    #030c611a 103.77%
  );
}
.felio-agent-cover-gradient {
  background: linear-gradient(
    169.4deg,
    rgba(57, 132, 244, 0.04) -6.01%,
    rgba(12, 211, 255, 0.04) 36.87%,
    rgba(47, 124, 240, 0.04) 78.04%,
    rgba(14, 101, 232, 0.04) 103.77%
  );
}
.felio-agent-cover-gradient-2 {
  background: linear-gradient(
    169.4deg,
    #6c493d1a -6.01%,
    #673a2b1a 36.87%,
    #5c6c3d1a 78.04%,
    #5267261a 103.77%
  );
}
.bg-blue-gradient,
.text-gradient {
  background: linear-gradient(136.91deg, #468ef9 -12.5%, #0c66ee 107.5%);
}
.text-gradient {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
