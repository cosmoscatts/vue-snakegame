<script setup lang="ts">
import { GameMap } from '~/logic/GameMap'

const refParentEl = ref<HTMLDivElement>()
const refCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  // eslint-disable-next-line no-new
  new GameMap(refCanvas.value!.getContext('2d')!, refParentEl.value!)
})
</script>

<template>
  <div
    ref="refParentEl"
    flex justify-center items-center
    :style="{ height: 'calc(100% - 8vh)' }"
  >
    <canvas ref="refCanvas" />
  </div>
</template>
