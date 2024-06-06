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

const menuFlag = ref(false)

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
      console.error(err)
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
  dialogFormVisible.value = false
}

const changeMenu = () => {
  menuFlag.value = !menuFlag.value
}
</script>

<template>
  <div class="home">
    <div class="nav">
      <span class="icon-menu" @click="changeMenu"></span>
      <div class="nav-container" :class="{'actived': menuFlag}">
        <ul class="list">
          <li class="list-wrap">
            <div class="list-icon"></div>
            <div class="list-content" v-if="menuFlag">测试数据</div>
          </li>
        </ul>
      </div>
    </div>
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
.nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background-color: #fff;
  .nav-container {
    position: relative;
    width: 50px;
    background-color: #fff;
    transition: all 0.1s ease;
  }
  .nav-container.actived {
    width: 150px;
  }
  .list-wrap {
    display: flex;
    align-items: center;
    .list-icon {
      background: url('../static/gpt.jpeg') no-repeat;
      width: 30px;
      height: 30px;
      background-size: contain;
    }
    .list-content {
    }
  }
}
</style>