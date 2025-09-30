<script setup>
import Header from "~/components/appLayouts/header.vue";
import TargetCursor from "~/components/vue-bits/TargetCursor/TargetCursor.vue"

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Devamosaic'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

</script>

<template>
  <UApp>
     <TargetCursor
        :spin-duration="2"
        :hide-default-cursor="true"
    />
    <Header />

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
