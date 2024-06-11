<script setup lang="ts">
import { ref, onMounted } from 'vue'

</script>

<template>
    <div class="picture">
        图片管理器
    </div>
</template>

<style lang="less" scoped>
.picture {
    width: 800px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--background-color-card);
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
}
</style>