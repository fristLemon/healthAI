<template>
  <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="50%" @close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
          <el-option v-for="item in categories" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要（可选）  " maxlength="1000" show-word-limit :rows="4" clearable />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tags" placeholder="请选择标签" 
          multiple clearable>
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-uploader">
          <el-upload class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :before-upload="beforeUpload"
            :http-request="handleAvatarSuccess"
          >
            <div v-if="!imgUrl" class="cover-place">
              <p>点击上传封面</p>
            </div>  
            <el-image v-else :src="imgUrl" class="avatar" />
          </el-upload>
          <el-button v-if="imgUrl" type="danger" size="small" @click="handleRemove">移除封面</el-button>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor v-model="formData.content" placeholder="请输入文章内容"
          :maxCharCount="5000" min-height="400px"
          @change="handleContentChange" @created="handleContentCreate" />
      </el-form-item>
    </el-form>  
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{btnPreview ? '取消预览' : '预览'}}</el-button>
      <el-button @click="handleClose()">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{isEdit ? '更新文章' : '创建文章'}}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile, knowledgeArticle, knowledgeArticleUpdate } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { Article, CategoryOption } from '@/types'

const visible = ref(false)
const props = withDefaults(defineProps<{
  modelVal: boolean
  categories: CategoryOption[]
  nowArticle: Article | null
}>(), {
  categories: () => [],
  nowArticle: null,
})
const emit = defineEmits(['update:modelVal', 'success'])
const dialogVisible = computed({
  get: () => props.modelVal,
  set: (val) => emit('update:modelVal', val)
})
const isEdit = computed(() => !!props.nowArticle?.id)
watch(() => props.nowArticle, (newVal) => {
  if (newVal) {
    Object.assign(formData, {
      ...newVal,
      tags: Array.isArray(newVal.tags) ? newVal.tags : newVal.tags ? newVal.tags.split(',') : [],
    })
    businessId.value = newVal.businessId
    imgUrl.value = newVal.coverImage ? fileBaseUrl + newVal.coverImage : ''
  }
})
const handleClose = () => {
  formRef.value.resetFields()
  businessId.value = null
  handleRemove()
  emit('update:modelVal', false)
}

const formData = reactive({
    title: "",
    content: "",
    coverImage: "",
    categoryId: '',
    summary: "",
    tags: [] as string[],
    id: ""
})
const rules = reactive({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
})
const commonTags = ['情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧']

const uploadUrl = '/back/article/upload'
const imgUrl = ref('')
const businessId = ref<string | null>(null)
const beforeUpload = (file: File) => {
  const isimg = file.type.startsWith('image/')
  const isli5 = file.size / 1024 / 1024 < 5
  console.log('beforeUpload---', file, isimg, isli5)
  if (!isimg) {
    ElMessage.error('上传封面图片，请选择图片文件!')
    return false
  }
  if (!isli5) {
    ElMessage.error('上传封面图片大小不能超过5MB!')
    return false
  }
  return true;
}
const handleAvatarSuccess = async ({file}: { file: File }) => {
  console.log(file, '--handleAvatarSuccess')
  businessId.value = crypto.randomUUID()
  const res = await uploadFile(file, {
    businessId: businessId.value
  })
  console.log(res, '--res')
  imgUrl.value = `${fileBaseUrl}${res.filePath}`;
  formData.coverImage = res.filePath
}
const handleRemove = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}
const handleContentChange = (val: { html: string }) => {
  console.log(val, '--富文本val')
  formData.content = val.html
}
const editorInstance = ref(null)
const handleContentCreate = (editor) => {
  editorInstance.value = editor
  if (formData.content && editor) {
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}
const btnPreview = ref(false)

const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log(formData, fields)
      loading.value = true
      const params = {
        ...formData,
        tags: formData.tags.join(','),
      }
      if (isEdit.value) {
        knowledgeArticleUpdate(formData.id, params).then(res => {
          console.log(res);
          ElMessage.success('更新文章成功')
          loading.value = false
          emit('success')
        })
      } else {
        params.id = businessId.value
        knowledgeArticle(params).then(res => {
          console.log(res);
          ElMessage.success('创建文章成功')
          loading.value = false
          emit('success')
        })
      }  
    }
  })
}
</script>

<style scoped>
.avatar-uploader{
  width: 200px; height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #8b949e;
  background-color: #f6f8fa;
  .avatar{
    width: 200px; height: 120px;
  }
}
</style>
