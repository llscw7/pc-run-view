<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Close } from '@element-plus/icons-vue'

const emits = defineEmits(['captureImage'])
const props = withDefaults(defineProps<{
  imageUrl: string,
  source: string,
  setImageUrl: Function
}>(), {
  imageUrl: '',
})

const previewVisible = ref(false)
const imageTitle = ref('')

const { imageUrl, source } = toRefs(props)

window.electronAPI.pathBasename(imageUrl.value).then((res: string)=>{
  imageTitle.value = res
})

const handleRemove = (e: Event) => {
  props.setImageUrl('')
  e.stopPropagation()
}

const handlePreview = () => {
    previewVisible.value = true
}

const handleSelect = ()=>{
  window.electronAPI.selectImage().then((res: any)=>{
    if(res.status.code === 0) {
      if(res.result) {
        props.setImageUrl(res.result.url)
        imageTitle.value = res.result.name
      }
    }else {
      ElMessage.error(res.status.message || 'unknown error')
    }
  })
}

const handleCapture = () => {
  emits('captureImage', source.value)
}
</script>

<template>
  <div class="upload-image">
    <div class="upload-image-wrap">
      <el-button type="primary" @click="handleSelect">选择图片</el-button>
      <el-button type="primary" @click="handleCapture" v-if="false">截图</el-button>
      <div class="image-list" v-if="imageUrl">
        <div class="image-list-wrap" @click="handlePreview">
          <el-icon class="image-file"><Document /></el-icon>
          <div class="image-name">{{ imageTitle }}</div>
          <el-icon class="image-delete" @click="handleRemove"><Close /></el-icon>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="previewVisible"
      width="800"
      title="预览"
      append-to-body
    >
      <img class="image-preview" :src="imageUrl" alt="Preview Image" v-if="imageUrl" />
      <span v-else>未选择图片</span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.upload-image-wrap {
  margin:5px 0;
  .image-list {
    width: 300px;
    height: 30px;
    .image-list-wrap {
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
        .image-name {
          color: var(--text-color-active);
        }
      }
      .image-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 250px;
      }
      .image-file {
        margin-right: 5px;
      }
      .image-delete {
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
.image-preview {
  width: 100%;
}
</style>