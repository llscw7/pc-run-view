<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllImages } from '../api/request'
import BigNumber from "bignumber.js";

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
    test(msgs)
})

const test = (arr: any, w = 800) => {
    let width = Infinity
    let index = -1
    for(let i = 0; i < arr.length; i++) {
        if(width > arr[i].width) {
            width = arr[i].width
            index = i
        }
    }
    console.log(width, '====', index)
    let maxH = arr[index].height
    const res = testW(arr, maxH)
    if(res) {
        
    }
}

const testW = (arr: any, maxH: number) => {
    let sum = 0
    let res = []
    for(let i = 0; i < arr.length; i++) {
        const w = new BigNumber(arr[i].width)
        const h = new BigNumber(arr[i].height)
        const tmp = new BigNumber(maxH)
        const newW = w.div(h).times(tmp).toFormat(0).toString()
        sum += +newW
        res.push({
            width: newW,
            height: maxH
        })
        if(sum > 800) return false
        if(sum === 800) return res
        console.log(newW,'------222')
    }
}

const getImageMessage = async (url: string) => {
    const img = new Image()
    return new Promise((resolve, reject) => {
        img.onload = () => {
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