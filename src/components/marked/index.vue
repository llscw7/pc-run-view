<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import {Marked} from 'marked'
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css';
import '../../assets/style.css'
import './markdown.less';
import { uploadImage } from '../../api/request'
import UploadImage from '../upload-image/index.vue'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  markedEdit: {
    type: Boolean,
    default: false,
  },
  markedPreview: {
    type: Boolean,
    default: false,
  }
})

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
)
marked.use({
    gfm: true,
    breaks: true
});

const md = ref(props.value.trim())

const markedInput = ref()

const { markedEdit, markedPreview } = toRefs(props)

const $reset = () => {
  md.value = props.value.trim()
}

const html = computed(() => {
  // const format = md.value.replace(/\n/g, "<br>")
  return marked.parse(md.value);
});

const color = ref('#000000')
const predefineColors = ref([
  '#000000',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeColor = (color: string | null) => {
  updateMD(`<span style="color: ${color}">示例文本</span>`)
}

const updateMD = (content: string) => {
  const textarea = markedInput.value.$refs.textarea
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  md.value = md.value.substring(0, startPos)
        + '\n' + content
        + md.value.substring(endPos, md.value.length);
}

/**
 * 支持通过复制粘贴上传图片
 */
const handlePaste = (event: ClipboardEvent) => {
  const types = event.clipboardData?.types;
  if (types?.includes('Files')) {
    const items: any = event.clipboardData?.items
    for (const index in items) {
      const item = items[index]
      // 获取粘贴的文件
      if(item.kind === 'file') {
        const file = item.getAsFile()
        if (file?.type.includes('image')) {
          // 处理图片粘贴
          uploadImage(file).then((res: ResponseParam.Result) => {
            const {result, status} = res
            if(status.code === 0 && result) {
              const url = result.url || ""
              const name = result.name || "default"
              updateMD(`![${name}](${url})`)
            }
          })
        }else {
          // 处理其他文件类型
          console.log('粘贴的其他文件：', file);
        }
        break;
      }
    }
    console.log('File paste end.')
  } else if (types?.includes('text/plain')) {
    // 处理文本粘贴
    const text = event.clipboardData?.getData('text/plain');
    console.log('粘贴的文本内容：', text);
  }
    
}

const setImageUrl = (data: ImageItem) => {
  updateMD(`![${data.name}](${data.url})`)
}

defineExpose({
  md,
  $reset
})

</script>

<template>
  <div class="marked-container">
    <!-- <template v-if="markedEdit">
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template> -->
    
    <div class="marked-toolbar" v-if="markedEdit">
      <div class="toolbar-wrap">
        <div class="toolbar-button" style="font-weight: bold;font-size: 16px;" @click="updateMD('## 示例文本')">H</div>
        <div class="toolbar-button icon-bold" @click="updateMD('**示例文本**')"></div>
        <div class="toolbar-button icon-underline" @click="updateMD('<u>示例文本</u>')"></div>
        <div class="toolbar-button icon-italic" @click="updateMD('_示例文本_')"></div>
        <div class="toolbar-button icon-strikethrough" @click="updateMD('~~示例文本~~')"></div>
        <div class="toolbar-button icon-quotes-right" @click="updateMD('> 示例文本')"></div>
        <div class="toolbar-button icon-embed2" @click="updateMD('```\n示例文本\n```')"></div>
        <div class="toolbar-button icon-link" @click="updateMD('[示例链接](https://www.baidu.com)')"></div>

        <UploadImage :setImageUrl="setImageUrl" :slotUse="true" >
          <div class="toolbar-button icon-image" ></div>
        </UploadImage>
        
        <div class="toolbar-button icon-list-numbered" @click="updateMD('1. 第一项\n2. 第二项\n    1. 子项1')"></div>
        <div class="toolbar-button icon-list2" @click="updateMD('- 第一项\n- 第二项\n    - 子项1')"></div>
        <!-- <div class="toolbar-button icon-indent-decrease"></div> -->
        <!-- <div class="toolbar-button icon-indent-increase"></div> -->
        <div class="toolbar-button icon-paragraph-left"></div>
        <div class="toolbar-button icon-paragraph-center"></div>
        <div class="toolbar-button icon-paragraph-right"></div>
        <div class="toolbar-button icon-paragraph-justify"></div>
        <el-color-picker v-model="color" show-alpha :predefine="predefineColors" size="small" @change="changeColor" />
      </div>
    </div>
    <div class="marked-edit" v-if="markedEdit && !markedPreview">
      <div class="marked-edit-content">
        <el-input
          class="marked-input"
          v-model="md"
          :rows="10"
          @paste="handlePaste"
          type="textarea"
          placeholder="Please input"
          ref="markedInput"
        />
      </div>
    </div>
    <div class="marked-preview" v-html="html" v-else></div>
  </div>
</template>

<style lang="less" scoped>
.marked-container {
  width: 100%;
  .marked-edit {
    .marked-edit-content {
      .marked-input {
        width: 100%;
      }
    }
  }
}
.toolbar-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 1px 6px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
}

</style>