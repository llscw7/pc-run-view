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
    let maxH = arr[index]?.height || 0
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
                <div class="picture-mask">

                </div>
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
        width: 900px;
        background-color: var(--background-color-card);
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
        
        display: flex;
        flex-wrap: wrap;
    }
    .picture-wrap {
        position: relative;
        flex: 1 0 auto;
        margin: 2px;
        box-sizing: border-box;
        .image {
            position: relative;
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        
    }
    .picture-wrap:hover {
        &::after {
            content: '';
            position: absolute;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.2);
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
    }
    
}
</style>