<script setup lang="ts">
import { GameMap } from '~/logic/GameMap'
import { useStore } from '~/store'

const refParentEl = ref<HTMLDivElement>()
const refCanvas = ref<HTMLCanvasElement>()
const gameMap = ref<GameMap | null>(null)

const store = useStore()

onMounted(() => {
  gameMap.value = new GameMap(refCanvas.value!.getContext('2d')!, refParentEl.value!, store as any)
})

const restart = () => {
  gameMap.value?.restart()
}
</script>

<template>
  <div
    ref="refParentEl"
    relative flex justify-center items-center
    :style="{ height: 'calc(100% - 8vh)' }"
  >
    <canvas ref="refCanvas" tabindex="0" />
    <div
      v-if="store.restart"
      absolute top="[1/2]" left="[1/2]" w150px h50px
      rounded-2 flex justify-center items-center
      :style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
    >
      <button font-bold text="xl white" @click="restart">
        开始游戏
      </button>
    </div>
  </div>
</template>
