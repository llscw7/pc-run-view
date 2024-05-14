<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { useOptionStore } from '../../store/store'

const emits = defineEmits(['closeDialog', 'setCurrentListData'])
const props = defineProps({

})

const store_option = useOptionStore()

const fileInput = ref()

const activedFile = ref()

const dropzoneDragOver =  (event: { stopPropagation: () => void; preventDefault: () => void; dataTransfer: any; }) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
};

const dropzoneDrop = async (ev: { stopPropagation: () => void; preventDefault: () => void; dataTransfer: any; }) => {
    ev.stopPropagation();
    ev.preventDefault();

    const file = ev.dataTransfer!.files[0];
    activedFile.value = file
}

const importDatabase = async (file: File) => {
    try {
        if (!file || !file.type.includes('json')) {
            ElMessage.error('只能放入JSON文件')
            return
        }
        console.log("Importing " + file.name, file.type);
        return window.electronAPI.importDatabase(file)
    } catch (error) {
        console.error(''+error);
    }
}

const handleUploadFile = () => {
    fileInput.value.click();
}

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if(fileInput.files && fileInput.files.length >0) {
        const file = fileInput.files[0];
        activedFile.value = file
    }
}

const onCloseDialog = () =>{
  emits('closeDialog')
}

const handleDelete = () => {
    activedFile.value = null
}

const submit = () => {
    if(!activedFile.value) {
        ElMessage({
            message: '请选择文件',
            type: 'warning'
        })
        return
    }
    importDatabase(activedFile.value).then(res=>{
        ElMessage({
            message: '导入成功',
            type: 'success'
        })
        emits('setCurrentListData', store_option.classType)
        onCloseDialog()
    }).catch(err=>{
        ElMessage.error('导入失败')
        console.error(err)
    })
}
</script>

<template>
    <el-dialog :model-value="true" title="导入数据库" width="600" :before-close="onCloseDialog">
        <div class="database-container">
            <div class="dropzone" @click="handleUploadFile" @dragover="dropzoneDragOver" @drop="dropzoneDrop" v-if="!activedFile">
                点击或拖拽JSON文件到此处
            </div>
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
            <div class="file-wrap" v-if="activedFile">
                <span>{{ activedFile.name }}</span>
                <el-icon @click="handleDelete"><Close /></el-icon>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCloseDialog">取消</el-button>
                <el-button type="primary" @click="submit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped lang="less">
.dropzone {
  width: 480px;
  height: 20px;
  border: 2px dotted #bbb;
  border-radius: 10px;
  padding: 35px;
  color: #bbb;
  text-align: center;
  cursor: pointer;
}
.file-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    &:hover {
        background-color: #f5f7fa;
    }
}
</style>