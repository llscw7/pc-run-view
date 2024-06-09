<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import menusvg from './static/menu.svg'

const menuFlag = ref(false)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeMenu = () => {
  menuFlag.value = !menuFlag.value
}

</script>

<template>
  <div class="app-container">
    <div class="nav">
      <div class="menu-button" @click="changeMenu">
        <img class="menu-icon" :src="menusvg" alt="" >
      </div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="menuFlag"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title><span>Group One</span></template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>item four</span></template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>Navigator Four</template>
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
  }
  .menu-icon {
    width: 30px;
    height: 30px;
  }
}
</style>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>