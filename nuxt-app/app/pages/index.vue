<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useNotion } from "~/composables/useNotion";
import type {NotionResponse} from "~/types/notion";
import Masonry from "~/components/vue-bits/Masonry/Masonry.vue";
import ImagesMasonry from "~/components/shares/ImagesMasonry.vue";
import GlassSurface from "~/components/vue-bits/GlassSurface/GlassSurface.vue";
import {useIntersectionObserver, useLocalStorage} from "@vueuse/core";

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

const shouldShowPopup = useLocalStorage('devamosaic-welcome-popup', true)
const isModalOpen = ref(false)
const hasShownPopup = ref(false)
const dontShowAgain = ref(!shouldShowPopup.value)

const tryOpenPopup = () => {
  if (!pending.value && isFinished.value && shouldShowPopup.value && !hasShownPopup.value) {
    isModalOpen.value = true
    hasShownPopup.value = true
  }
}

const handleCloseModal = () => {
  isModalOpen.value = false
}

if (process.client) {
  watch([pending, isFinished], () => {
    tryOpenPopup()
  }, { immediate: true })

  watch(shouldShowPopup, (value) => {
    dontShowAgain.value = !value
  })

  watch(dontShowAgain, (value) => {
    shouldShowPopup.value = !value
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
    <UModal
      :open="isModalOpen"
      :ui="{ width: 'max-w-xl' }"
      @close="handleCloseModal"
      @update:open="value => (isModalOpen = value)"
    >
      <template #content>
        <GlassSurface
          :width="'100%'"
          :height="'auto'"
          :border-radius="28"
          :background-opacity="0.18"
          :saturation="1.2"
          class-name="w-full"
        >
          <div class="flex flex-col gap-6 text-center px-8 py-10">
            <div class="space-y-3">
              <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                Chào mừng bạn đến với DevA Mosaic!
              </h2>
              <p class="text-neutral-700 dark:text-neutral-200">
                Mỗi bức ảnh ở đây là một mảnh ghép nhỏ của cộng đồng sáng tạo. Hy vọng bạn sẽ tìm thấy cảm hứng
                và chia sẻ yêu thương trong từng khoảnh khắc.
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <UCheckbox v-model="dontShowAgain" label="Không hiển thị lần sau" class="justify-center" />
              <UButton color="primary" class="mx-auto" @click="handleCloseModal">
                Tiếp tục khám phá
              </UButton>
            </div>
          </div>
        </GlassSurface>
      </template>
    </UModal>
  </div>
</template>
