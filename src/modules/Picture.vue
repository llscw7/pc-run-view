<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllImages, deleteData } from '../api/request'
import BigNumber from "bignumber.js";
import { Reading, Calendar, Close, Sort, More, Delete, CircleClose, CircleCheck, Top, Bottom } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const picture = ref<PictureItem[]>([])

onMounted(async ()=>{
    const res = await getAllImages()
    console.log(res,'-----', typeof res[0].modifiedTime)
    picture.value = res.map((item: allImageItem)=>{
        return {
            url: item.url,
            modifiedTime: item.modifiedTime,
            name: item.name,
            checked: false,
        }
    })
    sortPicture()
})

const sortType = ref('time')
const sortFlag = ref(0)
const sortPicture = () => {
    if(sortType.value === 'time') {
        picture.value = picture.value.sort((a,b)=>{
            const t1 = new Date(a.modifiedTime).getTime()
            const t2 = new Date(b.modifiedTime).getTime()
            if(sortFlag.value) {
                return t1-t2
            }else {
                return t2-t1
            }
        })
    }
    else if(sortType.value === 'name') {
        if(sortFlag.value) {
            picture.value = picture.value.sort((a,b)=> a.name.localeCompare(b.name))
        }else {
            picture.value = picture.value.sort((a,b)=> b.name.localeCompare(a.name))
        }
    }
    console.log(picture.value,'----;;;;')
}
/**
 * TODO: 区分时间正序和倒序
 * @param {number} type - 1: 升序  0: 降序
 */
const handleSort = (type: number) => {
    sortFlag.value = type
    sortPicture()
}

const changeSortType = (type: string) => {
    sortType.value = type
    sortPicture()
}


const count = computed(()=>{
    return picture.value.filter(item=>item.checked).length
})

const handleCancel = () => {
    picture.value = picture.value.map(item=>{
        item.checked = false
        return item
    })
}

const handleAll = () => {
    picture.value = picture.value.map(item=>{
        item.checked = true
        return item
    })
}

const handleDelete = () => {
    ElMessageBox.confirm(
        '这些项目将被彻底删除',
        `删除这个${count.value}项目？`,
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
        }
    )
    .then(() => {
        console.log('删除项目')
        const images = []
        for(let pic of picture.value) {
            if(pic.checked) {
                images.push(pic.url)
            }
        }
        deleteData({
            images: images
        })
        .then(res=>{
            if(res.status.code !== -1) {
                picture.value = picture.value.filter(item=>!item.checked)
            }
        })
    })
    .catch(() => {
        console.log('取消删除')
    })
}

const handlePreview = (url: string) => {
    const data = {
        url,
        srcList: picture.value.map(item=>item.url)
    }

    window.electronAPI.previewPicture(data)
}
</script>

<template>
    <div class="picture">
        <!-- TODO: 增加工具栏，处理图片多选情况 -->
        <div class="toolbar">
            <div class="title">
                所有图片（{{picture.length}} 张）
            </div>
            <div class="tool select" v-if="count" @click="handleCancel">
                <el-icon :size="18"><Close /></el-icon>
                <span>已选择 {{count}}</span>
            </div>
            <div class="tool delete" v-if="count" @click="handleDelete">
                <el-icon :size="18"><Delete /></el-icon>
            </div>
            <div class="tool sort">
                <el-popover
                    popper-class="more-popover"
                    placement="bottom-end"
                    :width="200"
                    trigger="hover"
                    :show-arrow="false"
                >
                    <template #reference>
                        <el-icon :size="17"><Sort /></el-icon>
                    </template>
                    <ul class="more-wrap">
                        <li class="more-item" @click="changeSortType('time')">
                            <div class="checkout-icon" :class="{show: sortType === 'time'}"></div>
                            <el-icon><Calendar /></el-icon>
                            <span>拍摄日期</span>
                        </li>
                        <li class="more-item" @click="changeSortType('name')">
                            <div class="checkout-icon" :class="{show: sortType === 'name'}"></div>
                            <el-icon><Reading /></el-icon>
                            <span>名字</span>
                        </li>
                        <li class="more-line"></li>
                        <li class="more-item" @click="handleSort(1)">
                            <div class="checkout-icon" :class="{show: sortFlag === 1}"></div>
                            <el-icon><Top /></el-icon>
                            <span>升序</span>
                        </li>
                        <li class="more-item" @click="handleSort(0)">
                            <div class="checkout-icon" :class="{show: sortFlag === 0}"></div>
                            <el-icon><Bottom /></el-icon>
                            <span>降序</span>
                        </li>
                    </ul>
                </el-popover>
            </div>
            <div class="tool more">
                <el-popover
                    popper-class="more-popover"
                    placement="bottom-end"
                    :width="200"
                    trigger="hover"
                    :show-arrow="false"
                >
                    <template #reference>
                        <el-icon :size="17"><More /></el-icon>
                    </template>
                    <ul class="more-wrap">
                        <li class="more-item" @click="handleAll">
                            <el-icon><CircleCheck /></el-icon>
                            <span>全选</span>
                        </li>
                        <li class="more-item" @click="handleCancel">
                            <el-icon><CircleClose /></el-icon>
                            <span>不选择任何项目</span>
                        </li>
                    </ul>
                </el-popover>
                
            </div>
        </div>
        <div class="picture-gallery">
            <div 
                class="picture-wrap" 
                v-for="(item, index) in picture" 
                :key="index"
                @dblclick="handlePreview(item.url)"
            >
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
        .delete {
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
        user-select: none;
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
.more-wrap {
    padding: 8px 0;
    .more-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 10px 15px;
        box-sizing: border-box;
        &:hover {
            background-color: rgba(0, 0, 0, 0.1)
        }
        span {
            margin-left: 8px;
        }
    }
    .more-line {
        width: 100%;
        height: 1px;
        background-color: #dedfe0;
        margin: 2px 0;
    }
    .checkout-icon {
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        visibility: hidden;
    }
    .checkout-icon.show {
        visibility: visible;
    }
}
</style>

<style>
.el-popover.el-popper.more-popover {
    padding: 0;
}
</style>