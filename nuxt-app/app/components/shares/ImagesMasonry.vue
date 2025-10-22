<script setup lang="ts">
import type { SimpleImage } from "~/types/notion";
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  images: SimpleImage[]
  finished: boolean
}>()

const isCurrentLoaded = ref<Record<string, boolean>>({})

const { width } = useWindowSize()

const columnCount = computed(() => {
  const currentWidth = width.value

  if (currentWidth >= 1536) {
    return 5
  }

  if (currentWidth >= 768) {
    return 4
  }

  if (currentWidth >= 640) {
    return 3
  }

  if (currentWidth >= 475) {
    return 2
  }

  return 1
})

const masonryColumns = computed(() => {
  const columns = Array.from({ length: columnCount.value }, () => [] as SimpleImage[])

  props.images.forEach((image, index) => {
    const columnIndex = index % columnCount.value
    columns[columnIndex].push(image)
  })

  return columns.filter((column, index) => column.length > 0 || index === 0)
})

watch(
  () => props.images,
  (images) => {
    const newLoaded: Record<string, boolean> = {}
    images.forEach((image) => {
      if (isCurrentLoaded.value[image.id]) {
        newLoaded[image.id] = true
      }
    })
    isCurrentLoaded.value = newLoaded
  },
  { immediate: true }
)

const handleImageLoad = (id: string, event: Event) => {
  isCurrentLoaded.value[id] = true

  const img = event.target as HTMLImageElement | null
  if (!img) {
    return
  }

  img.style.opacity = "1"
}
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
    <div class="flex w-full gap-4 transition duration-500">
      <div
        v-for="(column, columnIndex) in masonryColumns"
        :key="columnIndex"
        class="flex-1 min-w-0 flex flex-col gap-4"
      >
        <div
          v-for="item in column"
          :key="item.id"
          class="masonry-item cursor-target"
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
              class="block w-full h-auto rounded-[10px] transition duration-500 cursor-target"
              style="opacity: 0"
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
  </div>
</template>

<style scoped>
  .masonry-item img {
    transition-duration: 500ms;
  }
</style>
