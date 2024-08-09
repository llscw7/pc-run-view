<script setup lang="ts">
import { ref, onMounted } from 'vue'
onMounted(()=>{
    window.electronAPI.readdir().then((res: any)=>{
        console.log(res,'======')
    })
})
</script>

<template>
    <div class="test">

    </div>
</template>

<style lang="less" scoped>
.test {
    width: 100%;
    height: 100%;
}
</style>