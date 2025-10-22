<script setup lang="ts">
import { nextTick } from "vue";
import type {SimpleImage} from "~/types/notion";

const props = defineProps<{
  images: SimpleImage[]
  finished: boolean
}>()

const isCurrentLoaded = ref<Record<string, boolean>>({});
const rowSpans = ref<Record<string, number>>({})

const baseRowHeight = 8
const defaultRowSpan = 60

const currentImageLoaded = (id: string) => {
  isCurrentLoaded.value[id] = true;
};
const imgLoaded = computed(() => Object.values(isCurrentLoaded.value).length === props.images.length)

const showed = ref(false)
watch(imgLoaded, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showed.value = true
    }, 1200)
  }
})

watch(() => props.images, () => {
  rowSpans.value = {}
})

const calculateRowSpan = (img: HTMLImageElement) => {
  const width = img.parentElement?.clientWidth || img.clientWidth || img.naturalWidth || 1
  const naturalWidth = img.naturalWidth || width
  const naturalHeight = img.naturalHeight || width
  const ratio = naturalWidth ? naturalHeight / naturalWidth : 1
  const displayedHeight = width * ratio
  return Math.max(Math.round(displayedHeight / baseRowHeight), 1)
}

const handleImageLoad = (id: string, event: Event) => {
  currentImageLoaded(id)
  const img = event.target as HTMLImageElement | null
  if (!img) return

  nextTick(() => {
    rowSpans.value[id] = calculateRowSpan(img)
    img.style.opacity = "1"
  })
}

const getItemStyle = (id: string) => ({
  "--row-span": rowSpans.value[id] ?? defaultRowSpan,
})
</script>
<template>
  <div v-if="!finished">
    <div class="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 transition-opacity duration-500">
      <USkeleton
        v-for="(item, index) in 30"
        :key="index"
        :class="item % 2 === 0 ? 'aspect-3/2' : 'aspect-square'"
        class="w-full rounded-[10px]"
      />
    </div>
  </div>
  <div v-show="finished">
    <div class="masonry-grid grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 transition duration-500">
      <div
        v-for="item in images"
        :key="item.id"
        class="masonry-item cursor-target"
        :style="getItemStyle(item.id)"
      >
        <NuxtImg
          :src="item.src"
          :alt="item.id"
          preload
          provider="notion"
          quality="80"
          :custom="true"
          v-slot="{ src, isLoaded, imgAttrs }"
        >
          <img
            v-show="isLoaded"
            v-bind="imgAttrs"
            fetchPriority="high"
            :src="src"
            :alt="item.alt"
            class="w-full h-full object-cover rounded-[10px] transition duration-500 cursor-target"
            @load="event => handleImageLoad(item.id, event)"
          >
          <USkeleton
            v-show="!isLoaded"
            class="w-full h-full rounded-[10px]"
          />
        </NuxtImg>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .masonry-grid {
    display: grid;
    grid-auto-flow: dense;
    grid-auto-rows: 8px;
    align-items: start;
  }

  .masonry-item {
    grid-row-end: span var(--row-span, 60);
  }

  .masonry-item img {
    opacity: 0;
    transition-duration: 500ms;
  }
</style>
