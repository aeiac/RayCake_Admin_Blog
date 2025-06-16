<template>
  <div class="editor">
    <quill-editor
      ref="editorRef"
      v-model:content="content"
      :options="options"
      contentType="html"
    ></quill-editor>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, toRaw, onBeforeUnmount } from 'vue'
// 引入富文本编辑器与样式
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// 引入缩放图片的插件
import BlotFormatter from 'quill-blot-formatter'
Quill.register('modules/blotFormatter', BlotFormatter)

export default {
  components: {
    QuillEditor
  },
  setup() {
    const content = ref('')
    const editorRef = ref(null)
    let observer = null // MutationObserver 实例

    // 处理富文本图片上传
    const imageHandler = () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = async () => {
        const file = input.files ? input.files[0] : null
        if (file) {
          const formData = new FormData()
          formData.append('file', file)

          try {
            // TODO: 替换成你上传图片的接口请求，示例用fetch或axios都可以
            // const res = await axios.post('/upload/image', formData)
            // 假设接口返回格式是 { data: '图片URL' }
            // 这里用模拟url演示
            const res = { data: 'https://via.placeholder.com/150' }

            const quill = toRaw(editorRef.value).getQuill()
            if (quill) {
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'image', res.data)
            }
          } catch (error) {
            alert('图片上传失败')
          }
        }
      }
    }

    // 富文本配置
    const options = ref({
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ direction: 'ltr' }],
            [{ direction: 'rtl' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            ['blockquote', 'code-block'],
            ['clean'],
            ['link', 'image', 'video']
          ],
          handlers: {
            image: imageHandler
          }
        },
        blotFormatter: {
          toolbar: {
            mainClassName: 'blot-formatter__toolbar'
          }
        }
      }
    })

    const titleConfig = [
      { Choice: '.ql-bold', title: '加粗' },
      { Choice: '.ql-italic', title: '斜体' },
      { Choice: '.ql-underline', title: '下划线' },
      { Choice: '.ql-header', title: '段落格式' },
      { Choice: '.ql-strike', title: '删除线' },
      { Choice: '.ql-blockquote', title: '块引用' },
      { Choice: '.ql-code', title: '插入代码' },
      { Choice: '.ql-code-block', title: '插入代码段' },
      { Choice: '.ql-font', title: '字体' },
      { Choice: '.ql-size', title: '字体大小' },
      { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
      { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
      { Choice: '.ql-direction', title: '文本方向' },
      { Choice: '.ql-header[value="1"]', title: 'h1' },
      { Choice: '.ql-header[value="2"]', title: 'h2' },
      { Choice: '.ql-align', title: '对齐方式' },
      { Choice: '.ql-color', title: '字体颜色' },
      { Choice: '.ql-background', title: '背景颜色' },
      { Choice: '.ql-image', title: '图像' },
      { Choice: '.ql-video', title: '视频' },
      { Choice: '.ql-link', title: '添加链接' },
      { Choice: '.ql-clean', title: '清除字体格式' },
      { Choice: '.ql-script[value="sub"]', title: '下标' },
      { Choice: '.ql-script[value="super"]', title: '上标' },
      { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
      { Choice: '.ql-indent[value="+1"]', title: '向右缩进' }
    ]

    // 给富文本框工具栏加上鼠标悬浮中文提示
    const initTitle = () => {
      for (let item of titleConfig) {
        const tip = document.querySelector('.editor ' + item.Choice)
        if (tip) {
          tip.setAttribute('title', item.title)
        }
      }
    }

    onMounted(() => {
      nextTick(() => {
        initTitle()
      })

      const quill = editorRef.value.getQuill()
      const editorRoot = quill.root

      // 用 MutationObserver 监听编辑器内容变化，替代废弃的 DOMNodeInserted
      observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              console.log('新节点插入:', node)
              // 你可以在这里添加额外操作
            })
          }
        })
      })

      observer.observe(editorRoot, {
        childList: true,
        subtree: true
      })
    })

    onBeforeUnmount(() => {
      if (observer) observer.disconnect()
    })

    return {
      content,
      editorRef,
      options
    }
  }
}
</script>

<style scoped>
.editor {
  width: 100%;
}
:deep(.ql-editor) {
  min-height: 200px;
}
</style>
