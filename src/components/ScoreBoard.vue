<script setup lang="ts">
import ImageApple from '~/assets/apple.png'
import ImageCup from '~/assets/cup.png'
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
      <span ml-2vh mt-1vh>0</span>
    </div>
    <div flex items-center>
      <img :src="ImageCup" w-4vh>
      <span ml-2vh mt-1vh>0</span>
    </div>
  </div>
</template>
