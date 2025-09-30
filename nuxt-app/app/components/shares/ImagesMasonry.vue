<script setup lang="ts">
import type {SimpleImage} from "~/types/notion";
import {getImageHeight} from "~/utils/helper";

const props = defineProps<{
  images: SimpleImage[]
  finished: boolean
}>()

const isCurrentLoaded = ref<Record<string, boolean>>({});
const currentImageLoaded = (id: string) => {
  isCurrentLoaded.value[id] = true;
};
const imgLoaded = computed(() => Object.values(isCurrentLoaded.value).length === props.images.length)

</script>
<template>
  <transition name="slide-fade" :duration="{ enter: 500, leave: 800 }">
    <div v-if="!finished && !imgLoaded">
        <div class="gap-4 xs:columns-2 sm:columns-3 md:columns-4 2xl:columns-5 transition-opacity duration-500">
          <USkeleton v-for="(item, index) in 30" :key="index" :class="item % 2 === 0 ? 'aspect-3/2' : 'aspect-square'" class="mb-4" />
        </div>
    </div>
  </transition>
  <div v-if="finished">
    <div class="gap-4 xs:columns-2 sm:columns-3 md:columns-4 2xl:columns-5 transition duration-500">
      <NuxtImg
        v-for="(item, index) in images"
        :src="item.src"
        :alt="item.id"
        preload
        provider="notion"
        class="mb-4 w-full h-full object-cover rounded-[10px] transition duration-500 cursor-target"
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
