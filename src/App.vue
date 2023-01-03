<template>
  <div
    h-screen
    flex="~ col"
    justify-center
    items-center
    py20px
  >
    <Navbar />
    <PlayGround lt-sm:hidden />
    <div
      sm:hidden
      hfull wfull
      flex justify-center items-center
      text-lg
    >
      {  请在客户端访问 :). }
    </div>
  </div>
</template>

