<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllImages } from '../api/request'

const images = ref<string[]>([])

onMounted(async ()=>{
    const res = await getAllImages()

    images.value = res
})

</script>

<template>
    <div class="picture">
        图片管理器
        <div class="picture-gallery">
            <div class="picture-wrap" v-for="(item, index) in images" :key="index">
                <img class="image" :src="item" alt="" >
            </div>
        </div>
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
    .picture-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        padding: 10px;
    }
    .picture-wrap {
        position: relative;
        overflow: hidden;
        .image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    }
}
</style>