<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { FolderOpened, ArrowDown, Files } from '@element-plus/icons-vue'

const treeMap = ref()


onMounted(()=>{
    window.electronAPI.readdir('H:\\').then((res: ReadDirData[])=>{
        console.log(res,'======')
        treeMap.value = sortTreeMap(res)
    })
})

/**
 * 排序，先排列文件夹列表，再跟上文件列表
 */
const sortTreeMap = (arr: ReadDirData[]) => {
    if(!Array.isArray(arr)) return []
    const res = arr.sort((a,b)=>{
        if(a.type === 'dir' && b.type === 'file') {
            return -1;
        }
        if(a.type === 'file' && b.type === 'dir') {
            return 1;
        }
        return 0
    })
    return res
}

const handleShow = (data: ReadDirData, index: number) => {
    if(data.show) {
        treeMap.value[index].show = false
        const level = treeMap.value[index].level
        const len = treeMap.value.length
        let end = index
        for(let i = index + 1; i < len; i++) {
            if(treeMap.value[i].level <= level) {
                end = i
                break;
            }
        }
        if(end > index) {
            treeMap.value.splice(index + 1, end - index - 1)
        }else {
            treeMap.value.splice(index + 1, len - index - 1)
        }
    }else {
        treeMap.value[index].show = true
        window.electronAPI.readdir(data.path, data.id, data.level + 1).then((res: ReadDirData[])=>{
            console.log(res,'-------', index)
            const arr = sortTreeMap(res)
            treeMap.value.splice(index+1, 0, ...arr)
        })
    }
    
}

</script>

<template>
    <div class="test">
        <div class="dir-tree">
            <div class="tree-item" v-for="(item, index) in treeMap"  v-if="treeMap?.length">
                <div class="tree-wrap" :class="[`level-${item.level}`]" @click="handleShow(item, index)">
                    <div class="head-icon">
                        <el-icon v-if="item.type === 'dir'"><FolderOpened /></el-icon>
                        <el-icon v-else><Files /></el-icon>
                    </div>
                    <div class="tree-name">{{ item.name }}</div>
                    <div class="end-icon" v-if="item.type === 'dir'"><el-icon><ArrowDown /></el-icon></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.test {
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
    padding-left: 100px;
    box-sizing: border-box;
}
.dir-tree {
    width: 300px;
    .tree-item {

        .tree-wrap {
            display: flex;
            align-items: center;
            position: relative;
            padding: 10px 50px 10px 20px;
            margin-bottom: 4px;
            box-sizing: border-box;
            border-radius: 4px;
            overflow: hidden;
            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
        each(range(20), {
            .tree-wrap.level-@{value} {
                padding-left: (@value*20 + 20px);
            }
        });
    }
    .head-icon {
        margin-right: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tree-name {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
    }
    .end-icon {
        position: absolute;
        right: 20px;
    }
}
 
</style>