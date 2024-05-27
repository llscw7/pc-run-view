<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { Delete, Star, Position, Back, Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '../store/store'
import Marked from '../components/marked/index.vue'
import { submitData } from '../api/request'
import { queryImage } from '../utils/util'
import { useRouter } from 'vue-router';
const router = useRouter();

const store = useCardStore()
const { setAbout } = store
const {nowCardData} = storeToRefs(store)
const collectList: Ref<collectListParam[]> = ref([])

const goBack = () => {
  history.back()
}

const handleCollect = () => {
  window.electronAPI.getCollectList()
    .then((res: any) => {
      collectList.value = res
    })
    .catch((err: any) => {
      console.error('获取收藏列表错误: ', err)
    })
}

const collectCard = (cardData: QuickLinkDataItem, col: collectListParam) => {
  if(cardData?.custom_col?.includes(col.value)) {
    window.electronAPI.cancelCollect(cardData._id, col.value)
    .then((res: any)=>{
      ElMessage('已经取消收藏')
      cardData.custom_col = cardData.custom_col?.filter((item: string) => item !== col.value)
    })
    .catch((err: any)=>{
      console.error('卡片取消收藏错误: ', err)
    })
  }else {
    window.electronAPI.collect(cardData._id, col.value)
      .then((res: any) => {
        ElMessage('已收藏')
        cardData.custom_col?.push(col.value)
      })
      .catch((err: any) => {
        console.error('卡片收藏错误: ', err)
      })
  }
}

/**
 * 删除卡片
 */
 const handleDelete = () => {
  ElMessageBox.confirm(
    '确认删除该卡片？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const id = nowCardData.value._id
    window.electronAPI.deleteQuickLinkData(id).catch((err:any) => {
      console.error('卡片删除错误: ', err)
    })
    ElMessage({
      type: 'success',
      duration: 1000,
      message: 'Delete completed',
    })
    setTimeout(()=>{
      router.replace({path: '/'})
    }, 1000)
  }).catch((err) => {
    console.error('卡片删除错误: ', err)
    ElMessage({
      type: 'info',
      message: 'Delete canceled',
    })
  })
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
  markedEdit.value = false
  markedPreview.value = false
  if(markedRef.value.md) {
    const images = queryImage(markedRef.value.md)
    submitData({images: images})

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
        <el-popover
          popper-class="collect-popper"
          :width="200"
          placement="left-end"
          :show-arrow="false"
          :teleported="false"
          @show="handleCollect"
        >
          <template #reference>
            <el-button class="about-options__item" title="收藏" type="warning" :icon="Star" circle />
          </template>
          <ul class="collect-list">
            <li v-for="item in collectList" class="collect-list-item" :class="{'actived': nowCardData.custom_col?.includes(item.value)}" @click="collectCard(nowCardData, item)">
              {{ item.name }}
            </li>
          </ul>
        </el-popover>
        <el-button class="about-options__item" title="编辑" type="info" :icon="Edit" circle @click="editCard" />
        <el-button class="about-options__item" title="删除" type="danger" :icon="Delete" circle @click="handleDelete" />
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
  margin-top: 70px;
  margin-bottom: 30px;
  border-radius: 8px;
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
.collect-popper {
  .collect-list {
    padding: 5px;
    box-sizing: border-box;
    .collect-list-item {
      padding: 10px 20px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: var(--background-color-popper-hover);
      }
    }
    .collect-list-item.actived {
      background-color: var(--background-color-popper-hover);
    }
  }
}
</style>