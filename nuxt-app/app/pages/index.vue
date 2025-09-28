<script setup lang="ts">
import { useNotion } from "~/composables/useNotion";
import type {NotionResponse} from "~/types/notion";
import Masonry from "~/components/vue-bits/Masonry/Masonry.vue";
import ImagesMasonry from "~/components/shares/ImagesMasonry.vue";
import {useIntersectionObserver} from "@vueuse/core";

const { saveNotionData, notionGetMoreImages, allImages, currentCursor } = await useNotion()
const images = computed(() => allImages.value)

const NOTION_API_URL = '/api/notion/images'
const OPTIONS_API: Record<string, string> = {
  method: "POST",
}
const cursor = ref()
const { data, pending, execute }: { data: Ref<NotionResponse>, pending: Ref<boolean>, execute: () => {} } = await useAsyncData(
  `notion-images-post-${cursor.value}`,
  () => $fetch(NOTION_API_URL, {
    ...OPTIONS_API,
    body: {
      query: { start_cursor: cursor.value }
    }
  }),
  { immediate: true, watch: [cursor] },
)
await saveNotionData(data)

const loadMoreImages = async (cursor: string) => {
  if (cursor) {
    await notionGetMoreImages(cursor);
  }
};
const hasRequests = ref<string[]>([])
watch(currentCursor, async (newCursor) => {
  if (newCursor && !hasRequests.value.includes(newCursor)) {
    hasRequests.value.push(newCursor)
  }
}, { immediate: true })

onMounted(async () => {
  requestAnimationFrame(async () => {
    if (hasRequests.value.length) {
      for (const cursor of hasRequests.value) {
        await loadMoreImages(cursor)
      }
    }
  })
})
</script>

<template>
  <div>
    <div v-if="pending">Loading</div>
    <div v-else class="pt-[120px] px-4">
      <ImagesMasonry :images="images" />
    </div>
  </div>
</template>
