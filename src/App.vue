<script setup lang="ts">

</script>

<template>
  <div class="app-container">
    <router-view></router-view>
    <!-- <test /> -->
  </div>
</template>

<style lang="less" scoped>
.app-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  min-height: 100vh;
  background-color: var(--background-color-page);
}
</style>
