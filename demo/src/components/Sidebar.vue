<template>
  <div class="flex flex-col gap-2 fixed top-10 left-2 text-xl select-none">
    <div class="flex flex-col gap-2" v-scroll-spy-link v-scroll-spy-active="{class: `text-${color}-400`}">
      <a class="hover:text-red-800">Paragraph 1 </a>
      <a class="hover:text-red-800">Paragraph 2</a>
      <a class="hover:text-red-800">Paragraph 3</a>
      <a class="hover:text-red-800">Paragraph 4</a>
    </div>
    <div>Section Index: {{ currentSection }}</div>
    <div class="flex flex-col px-2 py-1">
      Color:
      <label
          v-for="(c, i) in colors"
          :key="`colour_${i}`"
          class="flex flex-row items-center cursor-pointer"
      >
        <input
            v-model="color"
            type="radio"
            name="colour"
            :value="c"
            class="mt-0.5 mr-1"
        />
        {{ c }}
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useScrollSpy } from '@aleios10/vue3-scroll-spy-composable'
import {ref} from "vue";

interface SidebarProps {
  currentSection: number
}

const props = defineProps<SidebarProps>()

const { vScrollSpyLink, vScrollSpyActive } = useScrollSpy()

const colors = ['red', 'green', 'blue', 'purple']
const color = ref('red')
</script>