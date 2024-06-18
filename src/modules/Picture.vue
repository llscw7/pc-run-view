<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllImages } from '../api/request'

const images = ref<string[]>([])

onMounted(async ()=>{
    const res = await getAllImages()
    images.value = res
    const msgs = []
    for(let v of res.slice(0,10)) {
        const msg = await getImageMessage(v)
        msgs.push(msg)
    }
    console.log(msgs,'====000')
})

const getImageMessage = async (url: string) => {
    const img = new Image()
    return new Promise((resolve, reject) => {
        img.onload = (...args) => {
            resolve({
                width: img.width,
                height: img.height
            })
        }
        img.src = url
    })
}

</script>

<template>
    <div class="picture">
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
            object-fit: contain;
            display: block;
        }
    }
}
</style>