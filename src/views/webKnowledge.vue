<template>
<div class="knowledge-container">
  <div class="header-section">
    <div class="header-content">
      <el-image style="width: 60px; height: 60px" :src="imgUrl"></el-image>
      <h1 class="title-label">心理健康知识库</h1>
    </div>
  </div>
  <div class="content">
    <div class="recommend-section">
      <div class="section-title">推荐阅读</div>
      <div class="recommend-list">
        <div v-for="item in knowledgeList" :key="item.id" class="recommend-item" @click="handleClick(item)">
          <h4>{{ item.title }}</h4>
          <p class="read-count"><el-icon><Histogram></Histogram></el-icon>阅读量：{{ item.readCount }}</p>
        </div>
      </div>
    </div>
    <div class="article-list">
      <div v-for="item in articleList" :key="item.id" class="article-item" @click="handleClick(item)">
        <el-image style="width: 240px; height: 150px" :src="getCover(item.coverImage)"></el-image>
        <div class="info">
          <div class="title">
            <h3>{{ item.title }}</h3>
            <el-tag plain type="primary">{{ item.categoryName }}</el-tag>
          </div>
          <div style="margin-top: 10px;">
            <div class="flex-box">
              <el-icon><Avatar></Avatar></el-icon>
              <span>{{ item.authorName }}</span>
            </div>
            <div class="flex-box">
              <el-icon><Calendar></Calendar></el-icon>
              <span>{{ dayjs(item.updatedAt) .format('YYYY-MM-DD') }}</span>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div class="flex-box">
              <el-icon><Platform></Platform></el-icon>
              <span>观看人数：{{ item.readCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="pagination-wrapper">
    <el-pagination style="margin-top: 20px;"
      layout="total, prev, pager, next"
      :total="pagination.total"
      :page-size.sync="pagination.size"
      @change="handlePaginationChange"
    />
  </div>
</div>
</template>  

<script setup>
import { dayjs } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getKnowledgeList } from '@/api/frontend'

const router = useRouter()
import imgUrl from '@/assets/images/book.png'

const knowledgeList = ref([])
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
const articleList = ref([])
const getArticleList = () => {
  getKnowledgeList({
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination,
  }).then(res => {
    articleList.value = res.records
    pagination.total = res.total
  })
}
const getCover = (coverImage) => {
  return coverImage ? 'http://159.75.169.224:1235'+coverImage : 'https://file.itndedu.com/psychology_ai.pn'
}
const handlePaginationChange = (page) => {
  pagination.currentPage = page
  getArticleList()
}
//跳转详情页
const handleClick = (item) => {
  router.push(`/webKnowledge/article/${item.id}`)
  console.log(item)
}
onMounted(() => {
  getArticleList()
  getKnowledgeList({
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: 1,
    size: 5,
  }).then(res => {
    knowledgeList.value = res.records
  })
})
</script>

<style lang="scss" scoped>
.knowledge-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  .flex-box {
      display: flex;
      align-items: center;
      span {
          margin-left: 10px;
      }
  }
  .header-section {
      background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
      color: white;
      padding: 48px;
      .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
      }
  }
  .content {
      display: flex;
      gap: 20px;
      margin: 0 auto;
      width: 1200px;
      padding: 20px;
      .recommend-section {
          width: 280px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          padding: 15px;
          height: 400px;
          .section-title {
              font-size: 12;
              font-weight: 600;
              color: #374151;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 5px;
          }
          .recommend-list {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              .recommend-item {
                  border-left: 4px solid #f59e0b;
                  padding-left: 10px;
                  cursor: pointer;
                  .read-count {
                      margin-top: 15px;
                      font-size: 12px;
                      color: #6b7280;
                      display: flex;
                      align-items: center;
                      gap: 10px;
                  }
              }
          }
      }
      .article-list {
        flex: 1;
        .article-item {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          .info {
              margin-left: 20px;
              .title {
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }
          }
        }
      }
  }
  .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding-bottom: 30px;
  }
}
</style>
