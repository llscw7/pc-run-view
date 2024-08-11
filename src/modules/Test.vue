<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FolderOpened, ArrowDown } from '@element-plus/icons-vue'
onMounted(()=>{
    window.electronAPI.readdir().then((res: any)=>{
        console.log(res,'======')
    })
})
</script>

<template>
    <div class="test">
        <div class="dir-tree">
            <div class="tree-item" v-for="item in 3">
                <div class="tree-wrap">
                    <div class="head-icon"><el-icon><FolderOpened /></el-icon></div>
                    <div class="tree-name">文件夹</div>
                    <div class="end-icon"><el-icon><ArrowDown /></el-icon></div>
                </div>
                <div class="tree-children">
                    <div class="tree-wrap">
                        <div class="head-icon"><el-icon><FolderOpened /></el-icon></div>
                        <div class="tree-name">文件夹</div>
                        <div class="end-icon"><el-icon><ArrowDown /></el-icon></div>
                    </div>
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
        .tree-children {
            .tree-wrap {
                padding-left: 40px;
            }
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