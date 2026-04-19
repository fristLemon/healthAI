<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategoryTree, getKnowledgeList, knowledgeArticleDetail, knowledgeArticleDelete, knowledgeArticleStatus  } from '@/api/admin'
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDig from '@/components/ArticleDig.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const fromItem = [
  {
    type: 'input',
    placeholder: '请输入搜索内容',
    label: '文字标题',
    prop: 'title'
  },
  {
    type: 'select',
    placeholder: '请选择分类',
    options: [],
    label: '分类',
    prop: 'categoryId'
  },
  {
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '草稿', value: '0' },
      { label: '已发布', value: '1' },
      { label: '已下线', value: '2' },
    ],
    label: '状态',
    prop: 'status'
  }
]
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})
const handleSearch = (datas) => {
  console.log(datas, '--from')
  const params = {
    ...pagination, ...datas
  }
  getKnowledgeList(params).then(res => {
    console.log(res);
    const { records, total } = res
    tableData.value = records
    pagination.total = total
  })
}
const handleChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}

const categoryMap = reactive({})
const categories = ref([])
const tableData = ref([])
const digVisible = ref(false)
const nowArticle = ref(null)

const handleSuccess = () => {
  digVisible.value = false
  handleSearch()
}
const handleEdit = (row) => {
  if (!row.id) {
    nowArticle.value = null
    digVisible.value = true
  } else {
    knowledgeArticleDetail(row.id).then(res => {
      console.log(res);
      nowArticle.value = res
      digVisible.value = true
    })
  } 
}
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    knowledgeArticleStatus(row.id, {
      status: 1
    }).then(res => {
      ElMessage.success('发布成功')
      handleSearch()
    })
  })
}
const handleUnPublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    knowledgeArticleStatus(row.id, { status: 2 }).then(res => {
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除${row.title}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    knowledgeArticleDelete(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}


onMounted(() => {
  getCategoryTree().then(res => {
    categories.value = res.map(item => {
      categoryMap[item.id] = item.categoryName
      return {
        label: item.categoryName,
        value: item.id
      }  
    })
    fromItem[1].options = categories.value
  })
  handleSearch()
})
</script>

<template>
  <div class="knowledge">
    <PageHead title="知识库">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增知识库</el-button>
      </template>
    </PageHead>
    <TableSearch :fromItem="fromItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column width="200" label="文字标题" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-icon><timer /></el-icon>
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="分类">
        <template #default="scope">
          {{ categoryMap[scope.row.categoryId] }}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="200" />
      <el-table-column prop="readCount" label="阅读量" width="200" />
      <el-table-column prop="updatedAt" label="发布时间" width="200" />
      <el-table-column width="230" label="操作" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
          <el-button @click="handleUnPublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 15px;"
      layout="total, sizes, prev, pager"
      :total="pagination.total"
      :page-size="pagination.size"
      @current-change="handleChange"
      @size-change="handleChange"
    />
    <ArticleDig v-model:modelVal="digVisible" :nowArticle="nowArticle" :categories="categories" @success="handleSuccess" />
  </div>
</template>