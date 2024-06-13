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
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .picture-gallery {
        width: 800px;
        background-color: var(--background-color-card);
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
        
        display: grid;
        // grid-template-columns: repeat(3, 80px) / auto-flow;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        grid-auto-rows: minmax(auto, 300px);
        grid-gap: 10px;
    }
    .picture-wrap {
        position: relative;
        overflow: hidden;
        .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }
}
</style>