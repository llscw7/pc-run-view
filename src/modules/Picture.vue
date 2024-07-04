<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllImages } from '../api/request'
import BigNumber from "bignumber.js";
import { Close, Sort, More } from '@element-plus/icons-vue'

const picture = ref<PictureItem[]>([])

onMounted(async ()=>{
    const res = await getAllImages()
    picture.value = res.map((item: string)=>{
        return {
            url: item,
            checked: false,
        }
    })
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

const count = computed(()=>{
    return picture.value.filter(item=>item.checked).length
})

</script>

<template>
    <div class="picture">
        <!-- TODO: 增加工具栏，处理图片多选情况 -->
        <div class="toolbar">
            <div class="title">
                所有图片（{{picture.length}} 张）
            </div>
            <div class="tool select" v-if="count">
                <el-icon :size="18"><Close /></el-icon>
                <span>已选择 {{count}}</span>
            </div>
            <div class="tool sort">
                <el-icon :size="17"><Sort /></el-icon>
            </div>
            <div class="tool more">
                <el-icon :size="17"><More /></el-icon>
            </div>
        </div>
        <div class="picture-gallery">
            <div class="picture-wrap" v-for="(item, index) in picture" :key="index">
                <img class="image" :src="item.url" alt="" >
                <div class="picture-select" :class="{'actived': item.checked}">
                    <el-checkbox class="select-item" :class="{'actived': item.checked}" v-model="item.checked" />
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
    .toolbar {
        position: relative;
        width: 900px;
        background-color: var(--background-color-card);
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .tool {
            height: 30px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 0, 0, 0.1)
            }
        }
        .select {
            width: 90px;
            span {
                margin-left: 2px;
                line-height: 30px;
            }
        }
        .sort {
            width: 30px;
        }
        .more {
            width: 30px;
        }
        .title {
            position: absolute;
            left: 20px;
            font-weight: bold;
            font-size: 18px;
            float: right;
        }
    }
    
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
        border-radius: 4px;
        overflow: hidden;
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
    .picture-select {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
        .select-item {
            position: absolute;
            top: 10px;
            right: 10px;
            height: 15px;
            visibility: hidden;
        }
        .select-item.actived {
            visibility: visible;
        }
        &:hover {
            .select-item {
                visibility: visible;
            }
        }
        :deep(.el-checkbox__inner) {
            background-color: rgba(0, 0, 0, 0.5)
        }
        :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
            background-color: var(--el-checkbox-checked-bg-color)
        }
    }
    .picture-select.actived {
        // border: 3px solid #4091ff;
        box-shadow: inset 0px 0px 0px 3px #4091ff;
        border-radius: 4px;
    }
}
</style>