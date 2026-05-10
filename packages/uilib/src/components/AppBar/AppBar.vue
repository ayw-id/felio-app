<template>
  <v-app-bar :clipped-left="clipped" fixed light>
    <v-app-bar-nav-icon v-if="navIconClicked" @click.stop="navIconClicked" />
    <!-- <v-btn v-if="miniVariantClicked" icon @click.stop="miniVariantClicked">
      <v-icon>mdi-chevron-{{ miniVariant ? 'left' : 'right' }}</v-icon>
    </v-btn> -->

    <v-avatar v-if="showLogo">
      <img :src="logoImage" alt="Felio.ID" />
    </v-avatar>
    <!-- <v-toolbar-title v-text="title" style="margin-left: 12px;" /> -->
    <v-spacer v-if="showAvatar" />
    <v-btn v-if="showAvatar" icon light class="mr-2" @click="avatarClicked">
      <v-avatar>
        <img :src="avatarImage" :alt="avatarAlt" />
      </v-avatar>
    </v-btn>
    <!-- <v-btn
      icon
      @click.stop="rightDrawer = !rightDrawer"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn> -->
  </v-app-bar>
</template>
<script setup lang="ts">
const props = defineProps<{
  clipped?: boolean
  navIconClicked?: () => void
  miniVariantClicked?: () => void
  miniVariant?: boolean
  showLogo?: boolean
  logoImage?: string
  showAvatar?: boolean
  avatarClicked?: () => void
  avatarImage?: string
  avatarAlt?: string
}>()

const clipped = props.clipped === undefined ? true : props.clipped
const navIconClicked = props.navIconClicked
// const miniVariantClicked = props.miniVariantClicked
// const miniVariant = props.miniVariant
const showLogo = props.showLogo
const logoImage = props.logoImage
const showAvatar = props.showAvatar
const avatarClicked = props.avatarClicked
const avatarImage = props.avatarImage
const avatarAlt = props.avatarAlt || ''
</script>
