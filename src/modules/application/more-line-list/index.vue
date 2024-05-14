<script setup lang="ts">
import { toRefs } from 'vue'
import type { PropType } from 'vue'
import { MoreFilled, Edit, StarFilled, DeleteFilled, Star } from '@element-plus/icons-vue'

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
  }
})

const { quickLinkData } = toRefs(props)

const collectCard = (cardData: QuickLinkDataItem) => {
  window.electronAPI.collect(JSON.stringify(cardData))
    .then((res: any) => {
      ElMessage('已收藏')
    })
    .catch((err: any) => {
      console.error('卡片删除错误: ', err)
    })
}

</script>

<template>
  <div class="home-container">
      <template v-for="(data, index) in quickLinkData">
        <div class="home-wrap" v-if="data.img">
          <el-image class="home-wrap-image" :src="data.img" fit="cover"
            @click="goToAbout(data)" />
          <div class="home-wrap-content">
            <h3 class="home-wrap-content__item title">{{ data.title }}</h3>
            <p class="home-wrap-content__item factory">{{ data.factory }}</p>
            <p class="home-wrap-content__item createTime">{{ data.createTime }}</p>
          </div>
          <div class="home-wrap-options">
            <div class="option-collect" @click="collectCard(data)">
              <el-icon>
                <Star v-if="true" />
                <StarFilled v-else />
              </el-icon>
            </div>
            <el-dropdown trigger="click">
              <span class="more-option-icon">
                <el-icon :size="20">
                  <MoreFilled />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Edit" @click="editCard(data)">编辑</el-dropdown-item>
                  <el-dropdown-item :icon="DeleteFilled" @click="handleDelete(index, data)">删除</el-dropdown-item>
                  <el-dropdown-item :icon="StarFilled" @click="collectCard(data)">收藏</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="home-wrap" v-else>
          <div class="home-wrap-desc">
            {{ data.title }}
          </div>
        </div>
      </template>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  display: flex;
  flex-wrap: wrap;
  width: 800px;
  background-color: var(--background-color-card);
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}
.home-wrap {
  position: relative;
  width: 140px;
  // height: 100px;
  flex-shrink: 0;
  margin: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  border-radius: 4px;
  overflow: hidden;
}

.home-wrap-image {
  width: 100%;
  height: 100px;
  cursor: pointer;
}

.home-wrap-desc {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-wrap-content {
  padding: 4px;

  .home-wrap-content__item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &.title {
      margin: 0;
      font-size: 16px;
    }

    &.factory,
    &.createTime {
      margin: 0;
      font-size: 14px;
    }
  }
}

.home-wrap-options {
  position: absolute;
  bottom: 0;
  right: 8px;
  display: flex;
  cursor: pointer;

  .option-collect {
    margin-right: 5px;
    cursor: pointer;
  }

}
</style>