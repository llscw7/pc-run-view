<script setup lang="ts">
import { Search, CloseBold, Edit } from '@element-plus/icons-vue'
import EditDialog from '../edit-dialog/index.vue'
import ClassifyDialog from '../classify-dialog/index.vue'
import DatabaseDialog from '../database-dialog/index.vue'
import { ref, onMounted, Ref, toRefs } from 'vue'
import { useCardStore, useOptionStore } from '../../store/store'
import { storeToRefs } from 'pinia'

const store_card = useCardStore()
const { setCardData } = store_card
const { nowCardData } = storeToRefs(store_card)

const store_option = useOptionStore()

const emits = defineEmits(['setSearchListData'])

const props = defineProps({
  setCurrentListData: {
    type: Function,
    required: true,
  }
})

const dialogFormVisible = ref(false)
const dialogDatabaseVisible = ref(false)
const dialogClassifyVisible = ref(false)
const options_class: Ref<tbNameItem[]> = ref([])

const closeDialog = () => {
  dialogFormVisible.value = false
}

const closeClassifyDialog = async () => {
  options_class.value = await window.electronAPI.getClassify()
  dialogClassifyVisible.value = false
}

const closeDatabaseDialog = () => {
  dialogDatabaseVisible.value = false
}

const editCard = () => {
  // TODO: id需要主线程中调用函数生成，
  store_card.$reset()
  const data = store_card.cardData
  setCardData(data)
  dialogFormVisible.value = true
}

const options_sort = [
  {
    value: 'time',
    label: '时间',
  },
  // {
  //   value: 'factory',
  //   label: '厂商',
  // },
  {
    value: 'default',
    label: '默认',
  },
  {
    value: 'collect',
    label: '收藏夹',
  },
]

const handleSearch = (value: string) => {
  window.electronAPI.searchQuickLinkData(value).then((res: ResponseParam.getQuickLinkData) => {
    if (res.status.code === 0) {
      emits('setSearchListData', res.result)
    }
  })
}

const closeSearch = () => {
  props.setCurrentListData(store_option.classType)
  store_option.keywords = ''
}

const handleSort = (val: string) => {
  props.setCurrentListData(val)
}

const exportDatabase = () => {
  window.electronAPI.exportDatabase()
}

const importDatabase = () => {
  dialogDatabaseVisible.value = true
}

const createOptionClass = () => {
  ElMessageBox.prompt('请输入你的分类名称', '添加', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValidator: (value)=> {
      if(!value) {
        return false
      }
      return true
    },
    inputErrorMessage: '不能为空',
  })
    .then(async ({ value }) => {
      try {
        const result = await window.electronAPI.createTable(value)
        if(result) {
          ElMessage({
            type: 'success',
            message: '创建分类成功',
          })
          options_class.value = await window.electronAPI.getClassify()
        }else {
          ElMessage({
            type: 'info',
            message: '分类已存在',
          })
        }
      }catch(err) {
        console.error('创建分类失败：', err)
        ElMessage({
          type: 'error',
          message: `创建分类失败`,
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

/**
 * 分类 选择
 */
const handleClass = (val: string) => {
  store_option.classType = val
  props.setCurrentListData(val)
}

const editClassify = () => {
  dialogClassifyVisible.value = true
}

const updateClassify = async (data: tbNameItem[]) => {
  const newData = data.map((item, index) => {
    item.sort = index
    return item
  })
  try{
    await window.electronAPI.updateClassify('tb_name', JSON.stringify(newData))
    options_class.value = await window.electronAPI.getClassify()
  }catch(err) {
    ElMessage.error('数据更新失败！')
    console.error(err)
  }
}

/**
 * 需要暴露给父组件的属性
 */
defineExpose({
  // sortType
})

onMounted(async ()=>{
  options_class.value = await window.electronAPI.getClassify()
})

</script>

<template>
  <div class="header">
    <div class="header-select">
      <div class="header-filter">
        <div class="header-filter-wrap">
          <el-select v-model="store_option.classType" class="m-2" placeholder="Select" placement="bottom" @change="handleClass">
            <el-option v-for="item in options_class" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
          <el-icon class="edit-icon" :size="20" @click="editClassify"><Edit /></el-icon>
        </div>
      </div>
      <div class="search">
        <el-input v-model="store_option.keywords" placeholder="请输入" :prefix-icon="Search" @change="handleSearch" />
      </div>
    </div>
    <div class="header-options">
      <el-button type="primary" round @click="editCard">手动添加</el-button>
      <el-button type="primary" round @click="exportDatabase">导出数据库</el-button>
      <el-button type="primary" round @click="importDatabase">导入数据库</el-button>
      <el-button type="primary" round @click="createOptionClass">新增分类</el-button>
    </div>
    <!-- <div class="options-tips">自动扫描所选目录下的所有exe文件，生成快捷启动卡片</div> -->
    <div class="header-options" v-if="store_option.keywords">
      <el-button type="primary" round @click="closeSearch">{{ store_option.keywords }}&nbsp;<el-icon>
          <CloseBold />
        </el-icon></el-button>
    </div>
    <EditDialog 
      v-if="dialogFormVisible" 
      :nowCardData="nowCardData" 
      :setCardData="setCardData" 
      @closeDialog="closeDialog"
      @setCurrentListData="props.setCurrentListData" 
      type="create" 
    />
    <ClassifyDialog 
      v-if="dialogClassifyVisible" 
      :data="options_class"
      @handleClass="handleClass"
      @submit="updateClassify"
      @closeDialog="closeClassifyDialog"
    />
    <DatabaseDialog 
      v-if="dialogDatabaseVisible" 
      @closeDialog="closeDatabaseDialog"
      @setCurrentListData="props.setCurrentListData" 
    />
  </div>
</template>

<style lang="less" scoped>
.header {
  padding: 20px;
  background-color: var(--background-color-card);
  border-radius: 5px;
  width: 800px;

  .header-select {
    width: 100%;
    min-width: 800px;
    display: flex;
    justify-content: space-between;

    .header-filter {
      .header-filter-wrap {
        display: flex;
        align-items: center;
        .edit-icon {
          margin-left: 10px;
          color: var(--text-color-active);
          cursor: pointer;
        }
      }
    }
  }

  .header-options {
    margin-top: 20px;
  }

  .options-tips {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    height: 20px;
    line-height: 20px;
  }
}
</style>