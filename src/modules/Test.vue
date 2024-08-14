<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FolderOpened, ArrowDown, Files } from '@element-plus/icons-vue'

const treeMap = ref()

onMounted(()=>{
    window.electronAPI.readdir('H:\\').then((res: ReadDirData[])=>{
        console.log(res,'======')
        treeMap.value = res
    })
})

const handleShow = (data: ReadDirData, index: number) => {
    window.electronAPI.readdir(data.path, data.id, data.level + 1).then((res: ReadDirData[])=>{
        console.log(res,'-------', index)
        treeMap.value.splice(index+1, 0, ...res)
    })
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
            padding: 10px 20px;
            margin-bottom: 4px;
            box-sizing: border-box;
            border-radius: 4px;
            overflow: hidden;
            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
        .tree-wrap.level-1 {
            padding-left: 40px;
        }
        .tree-wrap.level-2 {
            padding-left: 80px;
        }
    }
    .head-icon {
        margin-right: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tree-name {
        font-size: 16px;
    }
    .end-icon {
        position: absolute;
        right: 20px;
    }
}
</style>