<script setup lang="ts">
import type {SimpleImage} from "~/types/notion";
import {getImageHeight} from "~/utils/helper";

const props = defineProps<{
  images: SimpleImage[]
}>()

const isCurrentLoaded = ref<Record<string, boolean>>({});
const currentImageLoaded = (id: string) => {
  isCurrentLoaded.value[id] = true;
};

</script>
<template>
  <div v-if="!images.length">
    <div class="columns-4 gap-4">
      <USkeleton v-for="(item, index) in 30" :key="index" :class="item % 2 === 0 ? 'aspect-3/2' : 'aspect-square'" class="mb-4" />
    </div>
  </div>
  <div v-else>
    <div class="columns-4 gap-4 transition-opacity duration-500">
      <NuxtImg
        v-for="(item, index) in images"
        :src="item.src"
        :alt="item.id"
        preload
        provider="notion"
        class="mb-4 w-full h-full object-cover rounded-[10px] transition duration-300"
        quality="80"
        @load="currentImageLoaded(item.id)"
        :custom="true"
        v-slot="{ src, isLoaded, imgAttrs }"
      >
        <img
          v-show="isLoaded"
          v-bind="imgAttrs"
          fetchPriority="high"
          :src="src"
          :alt="item.alt"
        >
        <img
          v-show="!isLoaded"
          :src="item.srcLoading"
          alt="placeholder"
          class="w-full h-full object-cover rounded-[10px]"
        >
      </NuxtImg>
    </div>
  </div>

</template>
