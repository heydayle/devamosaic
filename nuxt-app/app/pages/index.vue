<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useNotion } from "~/composables/useNotion";
import type {NotionResponse} from "~/types/notion";
import Masonry from "~/components/vue-bits/Masonry/Masonry.vue";
import ImagesMasonry from "~/components/shares/ImagesMasonry.vue";
import {useIntersectionObserver} from "@vueuse/core";

const NOTION_API_URL = '/api/notion/images'
const OPTIONS_API: Record<string, string> = {
  method: "POST",
}

const { saveNotionData, notionGetMoreImages, allImages, currentCursor } = await useNotion()
const images = computed(() => allImages.value)

const isFinished = ref(false)
const hasRequests = ref<string[]>([])

const { data, pending, execute }: { data: Ref<NotionResponse>, pending: Ref<boolean>, execute: () => {} } = await useAsyncData(
  `notion-images-post-${currentCursor.value}`,
  () => $fetch(NOTION_API_URL, {
    ...OPTIONS_API,
    body: {
      query: { start_cursor: currentCursor.value }
    }
  }),
  { immediate: true, watch: [currentCursor.value] },
)
await saveNotionData(data)

const loadMoreImages = async (cursor: string) => {
  if (cursor) {
    await notionGetMoreImages(cursor);
  }
};

watch(currentCursor, async (newCursor) => {
  if (newCursor && !hasRequests.value.includes(newCursor)) {
    hasRequests.value.push(newCursor)
  }
}, { immediate: true })

const initScroll = () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  ScrollSmoother.create({
    effects: false,
    smooth: 2,
    content: '#main-layout'
  })
}

onMounted(async () => {
  requestAnimationFrame(async () => {
    initScroll()
    if (hasRequests.value.length) {
      for (const cursor of hasRequests.value) {
        await loadMoreImages(cursor)
        hasRequests.value = hasRequests.value.filter(e => cursor !== e)
        isFinished.value = hasRequests.value.length < 1
      }
    }
  })
})
</script>

<template>
  <div id="main-layout">
    <div v-if="pending">Loading</div>
    <div v-else class="pt-[120px] px-4 pb-4">
      <ImagesMasonry :images="images" :finished="isFinished" />
    </div>
  </div>
</template>
