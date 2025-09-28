<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import GlassSurface from "../vue-bits/GlassSurface/GlassSurface.vue";

const { app } = useAppConfig()
const colorMode = useColorMode()
const github = app.socials[0]
const { width } = useWindowSize()

onMounted(() => {
  colorMode.value = 'dark'
})

</script>
<template>
  <div class="fixed w-full top-0 z-10 px-4 py-4 mx-auto">
    <GlassSurface
      :width="width-(width*20/100)"
      :height="89"
      :border-radius="50"
      :blur="20"
      :displace="3.8"
      :distortion-scale="20"
      :saturation="0.8"
      :brightness="100"
      class-name="m-auto"
    >
      <div class="container px-4 flex justify-between items-center">
        <AppLogo class="flex-1" />
        <div class="flex flex-1 justify-end items-center space-x-2">
          <UColorModeButton />
          <UButton :to="github.href" variant="ghost" color="neutral" class="cursor-target text-xl text-white dark:text-white">
            <UIcon :name="github.icon" size="22" class="text-xl"/>
          </UButton>
          <UButton to="https://thinh.io.vn" variant="link" color="neutral" class="cursor-target text-xl mt-1">
            Thinh Le
          </UButton>
        </div>
      </div>
    </GlassSurface>
  </div>
</template>
