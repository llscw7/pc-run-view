<script setup lang="ts">
import { ref, onMounted, toRefs, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
let quill_view: Quill;
let quill_edit: Quill;

const props = defineProps({
  initData: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true
  }
})

const {initData, type} = toRefs(props)

function insertLocalImage() {
  window.electronAPI.selectImage().then((res: any)=>{
    if(res.status.code === 0) {
      if(res?.result?.url) {
        const range = quill_edit.getSelection(true);
        quill_edit.insertEmbed(range.index, 'image', res.result.url);
      }
    }else {
      ElMessage.error(res.status.message || 'unknown error')
    }
  })
  console.log('ceshihsuju ----', arguments)
}

const initQuill = (type: number) => {
  if(!quill_edit) {
    quill_edit = new Quill('#page-editor-about-edit', {
      readOnly: false,
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: insertLocalImage
          }
        },
      },
      // placeholder: '请输入...',
      theme: 'snow'  // or 'bubble'
    });
  }
  if(!quill_view) {
    quill_view = new Quill('#page-editor-about-view', {
      readOnly: true,
      modules: {
        toolbar: false
      },
      theme: 'bubble'
    });
  }
  
  const about = initData.value
  
  try {
    /**处理delta结构数据 */
    const data = JSON.parse(about)
    if(type === 1) {
      quill_edit.setContents(data)
    }else {
      quill_view.setContents(data)
    }
    /**处理delta结构数据 */
  }catch (err) {
    /**处理html结构数据 */
    if(type === 1) {
      var delta = quill_edit.clipboard.convert(about);
      console.log(delta)
      quill_edit.setContents(delta)
    }else {
      var delta = quill_view.clipboard.convert(about);
      console.log(delta)
      quill_view.setContents(delta)
    }
    /**处理html结构数据 */
    console.log(err)
  }
}

const getData = (type: number) => {
  if(type === 1) {
    return JSON.stringify(quill_edit.getContents())
  }else {
    return JSON.stringify(quill_view.getContents())
  }
}

defineExpose({
  getData
})

watch(type, (newValue, oldValue) => {
  initQuill(newValue)
  console.log('Count changed:', newValue);
});

onMounted(()=>{
  initQuill(type.value)
  console.log(initData.value,'???>>>22')
})
</script>

<template>
  <div class="quill-container">
    <div class="about-wrap" v-show="type === 1">
      <div id="toolbar">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <button class="ql-video"></button>

        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
        <button class="ql-direction" value="rtl"></button>

        <select class="ql-size">
          <option value="small"></option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <select class="ql-header">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
          <option selected></option>
        </select>
        <select class="ql-color">
        </select>
        <select class="ql-background">
        </select>
        <select class="ql-font">
        </select>
        <select class="ql-align">
        </select>
      </div>
      <div id="page-editor-about-edit"></div>
    </div>
    <div class="about-wrap" v-show="!type">
      <div id="page-editor-about-view"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.quill-container {
  width: 100%;
}
.about-wrap {
  width: 100%;
}
#page-editor-about-edit, #page-editor-about-view {
  width: 100%;
}
</style>