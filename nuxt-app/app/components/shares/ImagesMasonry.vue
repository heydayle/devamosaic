<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import type { SimpleImage } from "~/types/notion";
import GlassSurface from "~/components/vue-bits/GlassSurface/GlassSurface.vue";

const props = defineProps<{
  images: SimpleImage[]
  finished: boolean
}>()

const isCurrentLoaded = ref<Record<string, boolean>>({});
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

const { width } = useWindowSize();

const columnCount = computed(() => {
  const currentWidth = width.value;

  if (currentWidth >= 1536) return 5;
  if (currentWidth >= 768) return 4;
  if (currentWidth >= 640) return 3;
  if (currentWidth >= 475) return 2;
  return 1;
});

const createColumns = <T,>(items: T[]) => {
  const count = Math.max(columnCount.value, 1);
  const columns = Array.from({ length: count }, () => [] as T[]);

  items.forEach((item, index) => {
    columns[index % count].push(item);
  });

  return columns;
};

const imageColumns = computed(() => createColumns(props.images));
const skeletonColumns = computed(() => createColumns(Array.from({ length: 30 }, (_, index) => index)));

</script>
<template>
  <div v-if="!finished">
    <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-4 transition-opacity duration-500">
      <div
        v-for="(column, columnIndex) in skeletonColumns"
        :key="`skeleton-column-${columnIndex}`"
        class="flex flex-col gap-4"
      >
        <USkeleton
          v-for="(item, index) in column"
          :key="`skeleton-${columnIndex}-${index}`"
          :class="item % 2 === 0 ? 'aspect-3/2' : 'aspect-square'"
          class="rounded-[10px]"
        />
      </div>
    </div>
  </div>
  <div v-show="finished">
    <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-4 transition duration-500">
      <div
        v-for="(column, columnIndex) in imageColumns"
        :key="`image-column-${columnIndex}`"
        class="flex flex-col gap-4"
      >
          <NuxtImg
            v-for="item in column"
            :key="item.id"
            :src="item.src"
            :alt="item.id"
            preload
            provider="notion"
            class="w-full h-full object-cover rounded-[10px] transition duration-500 cursor-target"
            quality="80"
            @load="currentImageLoaded(item.id)"
            :custom="true"
            v-slot="{ src, isLoaded, imgAttrs }"
          >
            <UPopover
              arrow
              :ui="{
                content: 'bg-transparent ring-0 shadow-none',
              }"
            >
              <img
                v-show="isLoaded"
                v-bind="imgAttrs"
                fetchPriority="high"
                :src="src"
                :alt="item.alt"
                onload="this.style.opacity = 1"
              >
              <template #content>
                  <div class="p-2 w-full">
                  <ClientOnly>
                    <GlassSurface
                      width="100%"
                      height="auto"
                      :border-radius="15"
                      :blur="100"
                      :displace="6.8"
                      :distortion-scale="20"
                      :saturation="0.8"
                      :brightness="30"
                      class-name="m-auto"
                    >
                    <div class="flex flex-col p-2">
                      <p class="text-2xl text-white break-words font-serif">
                        {{ item.name || 'No description available.' }}
                      </p>
                      <p class="text-lg text-white break-words font-serif">
                        {{ item.description || 'No additional details.' }}
                      </p>
                    </div>
                      
                    </GlassSurface>
                    </ClientOnly>
                  </div>
              </template>
            </UPopover>
              <USkeleton
                v-show="!isLoaded"
                class="aspect-3/2 rounded-[10px]"
              />
          </NuxtImg>
      </div>
    </div>
  </div>

</template>

<style scoped>
  img {
    opacity: 0;
    transition-duration: 500ms;
  }
</style>
