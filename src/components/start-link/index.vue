<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Document, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  startLink: {
    type: String,
    required: true,
  },
  setStartLink: {
    type: Function,
    required: true,
  }
})

const { startLink } = toRefs(props)

const linkTitle = ref('')

window.electronAPI.pathBasename(startLink.value).then((res: string)=>{
  linkTitle.value = res
})

const handleSelect = ()=>{
  window.electronAPI.selectFile().then((res: any)=>{
    if(res.status.code === 0) {
      if(res.result) {
        props.setStartLink(res.result.path)
        linkTitle.value = res.result.fName
      }
    }else {
      ElMessage.error(res.status.message || 'unknown error')
    }
  })
}

const handleRemove = () => {
  props.setStartLink('')
}
</script>

<template>
  <div class="start-link">
    <el-button type="primary" @click="handleSelect">选择文件</el-button>
    <div class="start-link-tips">请选择程序启动文件</div>
    <div class="start-link-list" v-if="startLink">
      <div class="start-link-list-wrap">
        <el-icon class="start-link-file"><Document /></el-icon>
        <div class="start-link-name">{{ linkTitle }}</div>
        <el-icon class="start-link-delete" @click="handleRemove"><Close /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.start-link {
  margin:5px 0;
  .start-link-tips {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    height: 20px;
    line-height: 20px;
  }
  .start-link-list {
    width: 300px;
    height: 30px;
    .start-link-list-wrap {
      width: 100%;
      height: 100%;
      margin-top: 5px;
      display: flex;
      align-items: center;
      position: relative;
      padding:0 10px;
      box-sizing: border-box;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: var(--background-color-list);
        .start-link-name {
          color: var(--text-color-active);
        }
      }
      .start-link-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 250px;
      }
      .start-link-file {
        margin-right: 5px;
      }
      .start-link-delete {
        position: absolute;
        right: 10px;
        z-index: 999;
        width: 20px;
        height: 20px;
        &:hover {
          color: var(--text-color-active);
        }
      }
    }
  }
}
</style>