<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import Header from '../components/header/index.vue'
import EditDialog from '../components/edit-dialog/index.vue'
import MoreLineList from './application/more-line-list/index.vue'
import OneLineList from './application/one-line-list/index.vue'
import { useCardStore, useOptionStore } from '../store/store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()

const store = useCardStore()
const { setCardData } = store
const { nowCardData } = storeToRefs(store)

const store_option = useOptionStore()

const headerRef = ref()

const quickLinkData: Ref<QuickLinkDataItem[]> = ref([])

const initListData = (table: string) => {
  if (window?.electronAPI?.getQuickLinkData && typeof window.electronAPI.getQuickLinkData === 'function') {
    return window.electronAPI.getQuickLinkData(table).then((res: ResponseParam.getQuickLinkData) => {
      if(res.status.code === 0) {
        return res.result
      }else {
        return {}
      }
    }).catch((err: any) => {
      console.log(err)
      return {}
    })
  }
  return {}
}

/**
 * 
 * @param {*} type -分类
 */
const setCurrentListData = async (type: string) => {
  quickLinkData.value = await initListData(type)
}

const setQuickLinkData = (data: QuickLinkDataItem[]) => {
  quickLinkData.value = data
}

const setSearchListData = async (list: QuickLinkDataItem[]) => {
  quickLinkData.value = list
}

onMounted(async () => {
  if(store_option.keywords) {
    const { status, result } = await window.electronAPI.searchQuickLinkData(store_option.keywords)
    if(status.code === 0) {
      setSearchListData(result)
    }
  }else {
    setCurrentListData(store_option.classType)
  }
})

const goToAbout = (data: QuickLinkDataItem) => {
  setCardData(data)
  router.push(`/about?id=${data.id}`)
}

/**
 * 删除卡片
 */
const handleDelete = (key: number, data: QuickLinkDataItem) => {
  ElMessageBox.confirm(
    '确认删除该卡片？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    quickLinkData.value.splice(key, 1)
    window.electronAPI.deleteQuickLinkData(data._id).catch((err:any) => {
      console.error('卡片删除错误: ', err)
    })
    ElMessage({
      type: 'success',
      message: 'Delete completed',
    })
  }).catch((err) => {
    console.error('卡片删除错误: ', err)
    ElMessage({
      type: 'info',
      message: 'Delete canceled',
    })
  })
}

const dialogFormVisible = ref(false)
const editCard = (cardData: QuickLinkDataItem) => {
  setCardData(cardData)
  dialogFormVisible.value = true
}
const closeDialog = () => {
  console.log('测试数据0000')
  dialogFormVisible.value = false
}

</script>

<template>
  <div class="home">
    <Header ref="headerRef" :setCurrentListData="setCurrentListData" @setSearchListData="setSearchListData"></Header>
    <MoreLineList 
      v-if="false"
      :quickLinkData="quickLinkData"
      :goToAbout="goToAbout" 
      :editCard="editCard" 
      :handleDelete="handleDelete" 
    />
    <OneLineList 
      v-if="quickLinkData.length"
      :quickLinkData="quickLinkData"
      :goToAbout="goToAbout" 
      :editCard="editCard" 
      :handleDelete="handleDelete"
      @setQuickLinkData="setQuickLinkData"
    />
    <EditDialog 
      v-if="dialogFormVisible" 
      :nowCardData="nowCardData" 
      :setCardData="setCardData"  
      type="edit"
      @closeDialog="closeDialog" 
      @setCurrentListData="setCurrentListData" 
      @setSearchListData="setSearchListData"
    />
  </div>
</template>

<style lang="less" scoped>
.home {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>