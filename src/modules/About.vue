<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Delete, Star, Position, Back, Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '../store/store'
import Marked from '../components/marked/index.vue'

const store = useCardStore()
const { setAbout } = store
const {nowCardData} = storeToRefs(store)

const goBack = () => {
  history.back()
}

const startEXE = () => {
  if(nowCardData.value.startLink) {
    window.electronAPI.openApp(nowCardData.value.startLink).catch((err: Error)=>{
      console.error('程序启动异常: ', err)
      ElMessage({
        type: 'info',
        message: '程序启动异常，请检查启动链接',
      })
    })
  }else {
    ElMessage({
      type: 'info',
      message: '程序启动链接缺失',
    })
  }
}

const markedRef = ref()

const markedEdit = ref(false)
const markedPreview = ref(false)

const handleSave = async () => {
  console.log(markedRef.value.md,'[[[[]]]]')
  markedEdit.value = false
  markedPreview.value = false
  if(markedRef.value.md) {
    setAbout(markedRef.value.md)
  }
  try {
    await window.electronAPI.updateQuickLinkData(nowCardData.value._id, JSON.stringify(nowCardData.value))
  }catch(err) {
    console.error('更新卡片出错：', err)
  }
}

const handleChange = () => {
  markedPreview.value = !markedPreview.value
}

const handleCancel = () => {
  markedEdit.value = false
  markedPreview.value = false
  if(typeof markedRef.value.$reset === 'function') {
    markedRef.value.$reset()
  }
}

const editCard = ()=>{
  markedEdit.value = true
}

</script>

<template>
  <div class="about">
    <div class="about-header">
      <div class="header-back" @click="goBack"><el-icon><Back /></el-icon><div class="header-back-text">Back</div></div>
      <div class="header-title">{{ nowCardData.title_cn }}</div>
      <div class="header-option-wrap">
        <el-button type="warning" class="header-cancel" v-if="markedEdit" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="header-preview" v-if="markedEdit" @click="handleChange">{{ markedPreview ? '编辑' : '预览' }}</el-button>
        <el-button type="primary" class="header-save" v-if="markedEdit" @click="handleSave">保存</el-button>
      </div>
    </div>

    <div class="about-container">
      <Marked :value="nowCardData.about" :markedEdit="markedEdit" :markedPreview="markedPreview" ref="markedRef"></Marked>
      <div class="about-options">
        <el-button 
          class="about-options__item" 
          title="启动" 
          type="success" 
          :icon="Position" 
          circle
          @click="startEXE"
         />
        <el-button class="about-options__item" title="收藏" type="warning" :icon="Star" circle />
        <el-button class="about-options__item" title="编辑" type="info" :icon="Edit" circle @click="editCard" />
        <el-button class="about-options__item" title="删除" type="danger" :icon="Delete" circle />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.about {
  display: flex;
  justify-content: center;
}
.about-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background-color: #fff;
  .header-option-wrap {
    position: absolute;
    right: 20px;
    display: flex;
    align-items: center;
  }
  .header-save {
    flex-shrink: 0;
  }
  .header-preview {
    flex-shrink: 0;
  }
  .header-cancel {
    flex-shrink: 0;
  }
  .header-back {
    display: flex;
    align-items: center;
    cursor: pointer;
    .header-back-text {
      font-size: 14px;
      font-weight: 600;
      margin-left: 10px;
      padding-right: 15px;
      border-right: 1px solid #dcdfe6;
    }
  }
  .header-title {
    padding-left: 15px;
    font-size: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.about-container {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 30px;
  background-color: var(--background-color-default);
  .about-options {
    position: fixed;
    bottom: 50px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    button {
      margin-bottom: 10px;
    }
    :deep(.el-button+.el-button) {
      margin-left: 0;
    }
  }
}
.about-wrap {
  width: 100%;
}
#page-editor-about-edit, #page-editor-about-view {
  width: 100%;
}
</style>