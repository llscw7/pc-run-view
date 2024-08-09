<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Orange } from '@element-plus/icons-vue'
const value1 = ref(true)
</script>

<template>
    <div class="setting">
        <div class="setting-container">
            <div class="setting-label">个性化</div>
            <div class="setting-wrap" v-for="item in 3">
                <div class="icon">
                    <el-icon :size="25"><Orange /></el-icon>
                </div>
                <div class="setting-content">
                    <div class="title">自定义主题</div>
                    <div class="desc">选择颜色主题以赋予照片更多个性</div>
                </div>
                <div class="setting-option">
                    <el-switch v-model="value1" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.setting {
    width: 100%;
    height: 100%;
    .setting-container {
        position: relative;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 800px;
        overflow: hidden;
        .setting-label {
            font-size: 20px;
            font-weight: bold;
            line-height: 40px;
        }
        .setting-wrap {
            position: relative;
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 10px;
            padding: 10px 20px;
            margin-bottom: 10px;
            .icon {
                margin-right: 10px;
            }
            .setting-content {
                .title {
                    font-size: 20px;
                }
                .desc {
                    font-size: 16px;
                }
            }
            .setting-option {
                position: absolute;
                right: 20px;
            }
        }
    }
}
</style>
