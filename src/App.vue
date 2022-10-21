<script setup lang="ts">

</script>

<template>
  <div h-screen flex="~ col" justify-center items-center>
    <Navbar />
    <PlayGround lt-sm:hidden />
    <div
      sm:hidden
      hw-full
      flex-center
      text-lg
    >
      {  请在客户端访问 :). }
    </div>
  </div>
</template>

<style scoped>

</style>
