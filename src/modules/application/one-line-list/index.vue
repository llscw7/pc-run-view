<script setup lang="ts">
import { onMounted, toRefs, watch, ref, computed, Ref } from 'vue'
import { MoreFilled, Edit, StarFilled, DeleteFilled, Star, Position, FolderOpened } from '@element-plus/icons-vue'

const props = defineProps({
  quickLinkData: {
    type: Object,
    required: true
  },
  goToAbout: {
    type: Function,
    required: true
  },
  editCard: {
    type: Function,
    required: true
  },
  handleDelete: {
    type: Function,
    required: true
  },
})

const emits = defineEmits(['setQuickLinkData'])

const { quickLinkData } = toRefs(props)
const collectList: Ref<collectListParam[]> = ref([])

const listBottom = ref()
const total = computed(() => Math.ceil(quickLinkData.value.length / 10))
const page = ref(1)
const visibleData: Ref<QuickLinkDataItem[]> = computed(() => {
  return quickLinkData.value.slice(0, page.value * 10)
})

/**
 * TODO: 整体逻辑待优化
 * @param cardData 
 * @param col 
 */
const collectCard = (cardData: QuickLinkDataItem, col: collectListParam) => {
  if(cardData?.custom_col?.includes(col.value)) {
    window.electronAPI.cancelCollect(cardData._id, col.value)
    .then((res: any)=>{
      ElMessage('已经取消收藏')
      cardData.custom_col = cardData.custom_col?.filter((item: string) => item !== col.value)
      const cur = quickLinkData.value.filter((item: QuickLinkDataItem) => item._id !== cardData._id)
      emits('setQuickLinkData', cur)
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

const startEXE = (data: QuickLinkDataItem) => {
  if(data.startLink) {
    window.electronAPI.openApp(data.startLink).catch((err: Error)=>{
      console.error('程序启动异常: ', err)
      ElMessage({
        type: 'error',
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

const openFolder = (data: QuickLinkDataItem) => {
  if(data.startLink) {
    window.electronAPI.showItemInFolder(data.startLink).catch((err: Error) => {
      console.error('位置打开失败', err)
      ElMessage({
        type: 'error',
        message: '程序位置异常，请检查位置链接',
      })
    })
  }else {
    ElMessage({
      type: 'info',
      message: '位置缺失',
    })
  }
}

const handleCollect = (data: QuickLinkDataItem) => {
  window.electronAPI.getCollectList()
    .then((res: any) => {
      collectList.value = res
    })
    .catch((err: any) => {
      console.error('获取收藏列表错误: ', err)
    })
}

onMounted(()=>{
  window.onscroll = () => {
    if(listBottom.value?.getBoundingClientRect().top < 800) {
      if(page.value < total.value) {
        page.value += 1
      }
    }
  }
})

</script>

<template>
  <div class="home-container">
    <template v-for="(data, index) in visibleData">
      <div class="home-wrap">
        <el-image class="home-wrap-image" :src="data.img" fit="cover" @click="goToAbout(data)" />
        <div class="home-wrap-content">
          <div class="home-content-title" @click="goToAbout(data)">{{ data.title_cn }}</div>
          <div class="home-content-factory">厂商：{{ data.factory }}</div>
          <div class="home-content-createTime">时间：{{ data.createTime }}</div>
          <div class="home-wrap-option">
            <div class="option-start" :class="{'disabled': !data.startLink}" @click="startEXE(data)">
              <el-icon size="20">
                <Position />
              </el-icon>
              <span class="label-text">启动</span>
            </div>
            <span class="option-line">|</span>
            <div class="option-edit" @click="editCard(data)">
              <el-icon size="20">
                <Edit />
              </el-icon>
              <span class="label-text">编辑</span>
            </div>
            <span class="option-line">|</span>
            <!-- <div class="option-star" @click="collectCard(data)"> -->
            <div class="option-star">
              <el-popover popper-class="collect-popper" placement="right" :width="200" trigger="hover" @show="handleCollect(data)">
                <template #reference>
                  <div class="option-star-wrap">
                    <el-icon size="20">
                      <StarFilled v-if="data.collect" />
                      <Star v-else />
                    </el-icon>
                    <span class="label-text">收藏</span>
                  </div>
                </template>
                <ul class="collect-list">
                  <li v-for="item in collectList" class="collect-list-item" :class="{'actived': data.custom_col?.includes(item.value)}" @click="collectCard(data, item)">
                    {{ item.name }}
                  </li>
                </ul>
              </el-popover>
              
            </div>
            <span class="option-line">|</span>
            <div class="option-delete" @click="handleDelete(index, data)">
              <el-icon size="20">
                <DeleteFilled />
              </el-icon>
              <span class="label-text">删除</span>
            </div>
            <span class="option-line">|</span>
            <div class="option-folder" :class="{'disabled': !data.startLink}" @click="openFolder(data)">
              <el-icon size="20"><FolderOpened /></el-icon>
              <span class="label-text">文件</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="list-bottom" ref="listBottom">- 到底啦 -</div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  width: 800px;
  background-color: var(--background-color-card);
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

.home-wrap {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #efeff2;
}

.list-bottom {
  width: 100%;
  height: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
}

.home-wrap-image {
  width: 200px;
  height: 130px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.home-wrap-content {
  padding: 10px;
  font-size: 14px;
  line-height: 22px;
  position: relative;

  .home-content-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 10px;
    width: 600px;
    color: var(--text-color-active);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }

  .home-wrap-option {
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    width: 500px;
    color: var(--text-color-active);
    .option-start.disabled {
      cursor: not-allowed;
      color: #C0C4CC;
    }
    
    .option-folder.disabled {
      cursor: not-allowed;
      color: #C0C4CC;
    }

    .option-start,
    .option-edit,
    .option-delete,
    .option-star,
    .option-folder,
    .option-star-wrap {
      display: flex;
      cursor: pointer;
    }

    .option-line {
      margin: 0 10px;
    }

    .label-text {
      margin-left: 5px;
    }
  }
}

</style>

<style lang="less">
.el-popover.el-popper.collect-popper {
  padding: 0;
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