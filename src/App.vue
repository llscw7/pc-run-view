<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu as IconMenu,
  Setting,
  Picture
} from '@element-plus/icons-vue'
import menusvg from './static/menu.svg'


const route = useRoute()

const activedTab = ref(route.path)

const menuFlag = ref(true)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeMenu = () => {
  menuFlag.value = !menuFlag.value
}

watch(route, (cur, pre)=>{
  activedTab.value = cur.path
})

</script>

<template>
  <div class="app-container">
    <div class="nav">
      <div class="menu-button" @click="changeMenu">
        <img class="menu-icon" :src="menusvg" alt="" >
      </div>
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="activedTab"
        :collapse="menuFlag"
        :router="true"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="/">
          <el-icon><icon-menu /></el-icon>
          <template #title>主页</template>
        </el-menu-item>
        <el-menu-item index="/picture">
          <el-icon><Picture /></el-icon>
          <template #title>图片管理</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  min-height: 100vh;
  background-color: var(--background-color-page);
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
      flex-shrink: 0;
    }
    .list-content {
    }
  }
  .menu-button {
    cursor: pointer;
    padding: 10px 0 0 22px;
  }
  .menu-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>