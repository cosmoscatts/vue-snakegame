<script setup lang="ts">
const isDark = useDark()
const toggle = useToggle(isDark)
</script>

<template>
  <div
    w-70vw
    flex justify-center items-center
    pb8 mxa text-xl lt-md="flex-col gap-y-4 pb4"
  >
    <h1 text="4xl primary" font-bold>
      Vue SnakeGame
    </h1>
    <div flex items-center gap-x-3 ml10>
      <a icon-btn i-carbon-logo-github href="https://github.com/cosmoscatts/vue-snakegame" target="_blank" title="GitHub" />
      <button
        icon-btn
        i-carbon-sun dark:i-carbon-moon
        @click="toggle()"
      />
    </div>
  </div>
</template>
