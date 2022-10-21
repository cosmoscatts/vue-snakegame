<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ImageApple from '~/assets/apple.png'
import ImageCup from '~/assets/cup.png'
import { useStore } from '~/store'

const { score, record } = storeToRefs(useStore())
</script>

<template>
  <div
    h-8vh bg="[#4A752C]"
    flex justify-around items-center
    text="[2.5vh] white" font-bold
    select-none
  >
    <div flex items-center>
      <img :src="ImageApple" w-6vh>
      <span ml-2vh mt-1vh>{{ score }}</span>
    </div>
    <div flex items-center>
      <img :src="ImageCup" w-4vh>
      <span ml-2vh mt-1vh>{{ record }}</span>
    </div>
  </div>
</template>
