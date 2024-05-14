<script setup lang="ts">
import { ref, Ref, nextTick } from 'vue'
import { Rank, EditPen, Delete } from '@element-plus/icons-vue'
import Sortable from 'sortablejs';
import { useOptionStore } from '../../store/store'
const store_option = useOptionStore()


const emits = defineEmits(['closeDialog', 'submit', 'handleClass'])

const props = defineProps({
  data: {
    type: Array as () => tbNameItem[],
    required: true
  },
})

const newData: Ref<tbNameItem[]> = ref(props.data.map(item=>({
  ...item,
  editFlag: 0
})))

const resultData: Ref<tbNameItem[]> = ref(props.data)

const cacheData: Ref<string[]> = ref([])

const handleClose = () => {
  if(cacheData.value.indexOf(store_option.classType) > -1) {
    emits('handleClass', 'tb_list')
  }
  emits('closeDialog')
}

const submit = () => {
  emits('submit', resultData.value)
  handleClose()
}

const handleEdit = (data: tbNameItem) => {
  data.editFlag = 1
}

const editName = (data: tbNameItem, e: string) => {
  data.editFlag = 0
  const findIndex = resultData.value.findIndex(item=>item._id === data._id)
  resultData.value[findIndex] = Object.assign({}, resultData.value[findIndex], {name: data.name})
}

const handleDelete = (data: tbNameItem) => {
  ElMessageBox.confirm(
    `确认删除${data.name}？`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      newData.value = newData.value.filter(item=>item._id !== data._id)
      resultData.value = resultData.value.filter(item=>item._id !== data._id)
      //TODO: 删除数据库中的分类
      cacheData.value.push(data.value)
      const result = await window.electronAPI.deleteClassify(data._id, data.value)
      console.log(result,';;;.....')
      if(result) {
        ElMessage({
          type: 'success',
          message: '分类已删除',
        })
      }else {
        ElMessage({
          type: 'info',
          message: '分类删除失败',
        })
      }
    })
    .catch(() => {

    })
}

const inputHidden = () => {
  newData.value = newData.value.map(item=>({...item, editFlag: 0}))
}

nextTick(()=>{
  const dom = document.getElementById('llscw-classify-list')
  Sortable.create(dom, {
    group: 'llscw',
    animation: 200,
    handle: '.option-move',
    onEnd: function (evt: SortableEvent) {
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      const data = resultData.value.splice(oldIndex, 1)
      resultData.value.splice(newIndex, 0, data[0])
    }
  });
})
</script>

<template>
  <el-dialog
    :model-value="true"
    title="编辑分类"
    width="400"
    :before-close="handleClose"
  >
    <div class="classify-container" @click="inputHidden">
      <ul 
        class="list-group"
        id="llscw-classify-list"
      >
        <li 
          class="list-group-item" 
          v-for="(element, index) in newData"
          :key="index"
          >
          <div class="list-content">
            <el-input class="input-text" :class="element._id" v-show="element.editFlag" v-model="element.name" placeholder="Please input" @change="editName(element, $event)" @click.stop="handleEdit(element)" />
            <div class="text" v-show="!element.editFlag">{{ element.name }}</div>
          </div>
          <div class="list-option">
            <el-button class="custom-icon option-move" type="primary" :icon="Rank" circle />
            <el-button class="custom-icon" type="info" :icon="EditPen" circle @click.stop="handleEdit(element)" />
            <el-button class="custom-icon" type="danger" :icon="Delete" circle @click.stop="handleDelete(element)" />
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.classify-container {
  .list-group {
    min-height: 20px;
    .list-group-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      border-top: 1px solid #ebeef5;
      height: 50px;
      &:last-of-type {
        border-bottom: 1px solid #ebeef5;
      }
      &:hover {
        background-color: #f2f3f5;
      }
      .option-move {
        cursor: move;
      }
    }
  }
}
.sortable-ghost {
  opacity: .6;
}
</style>