<template>
  <div class="emotional">
    <PageHead title="情绪日志" />
    <TableSearch :fromItem="searchItem" @search="handleSearch" />
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="createTime" label="会话ID" width="80">
        <template #default="scope">
          <el-avatar>{{scope.row.nickname}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120" />
      <el-table-column prop="emotionotionalScore" label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>睡眠：{{scope.row.sleepQuality}}</p>
            <p>压力：{{scope.row.stressLevel}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="200" />
      <el-table-column prop="diaryContent" label="日志内容" width="200" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="primary" text>详情</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" text>删除</el-button>
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
    <el-dialog title="情绪日志详情" v-model="detailVisible" width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-content" v-if="nowDetail">
        <div class="detail-item">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{nowDetail.username}}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{nowDetail.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{nowDetail.userId}}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{nowDetail.diaryDate}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-item">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="nowDetail.moodScore" :max="10" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(nowDetail.dominantEmotion)">{{nowDetail.dominantEmotion || '-'}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{nowDetail.sleepQuality || '-'}}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{nowDetail.stressLevel || '-'}}/5</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-item">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">{{nowDetail.emotionTriggers}}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{nowDetail.diaryContent}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-item">
          <h4>AI情绪分析结果</h4>
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{aiData.primaryEmotion}}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress :percentage="aiData.emotionScore" :stroke-width="8" :color="getEmotionScoreColor(aiData.emotionScore)"></el-progress>
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <el-tag :type="getAiEmotionTagType(aiData.riskLevel)">{{aiData.riskLevel}}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiData.isNegative ? 'danger' : 'success'">{{aiData.isNegative ? '负面情绪' : '正面情绪'}}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="ai-suggestion-section">
              <h5>专业建议</h5>
              <div class="suggestion-content">{{aiData.suggestion || '-'}}</div>
            </div>  
            <div class="ai-risk-section">
              <h5>风险描述</h5>
              <div class="risk-content">{{aiData.riskDescription || '-'}}</div>
            </div>  
            <div class="ai-improvements-section">
              <h5>改善建议</h5>
              <ul class="improvement-list">
                <li v-for="item in aiData.improvementSuggestions" :key="item">{{item}}</li>
              </ul>
            </div> 
          </div>
        </div>  
        <div class="detail-item">
          <h4>时间信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{nowDetail.createdAt}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{nowDetail.updatedAt}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import PageHead from '@/components/pageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getEmotionalList, getEmotionalDelete } from '@/api/admin'
import type { ApiRecord, SearchItem } from '@/types'

const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}
const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}
const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}
const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}
const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}

const searchItem = ref<SearchItem[]>([
  {
    prop: 'userId',
    label: '用户ID',
    type: 'input',
    placeholder: '请输入用户ID',
  },
  {
    prop: 'emotionotionalScore',
    label: '情绪评分',
    type: 'select',
    placeholder: '请选择评分范围',
    options: [
      {label: '低分（1-3）', value: '1-3'},
      {label: '中分（4-6）', value: '4-6'},
      {label: '高分（7-9）', value: '7-9'},
    ]
  }  
])
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
const handleChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}
const tableData = ref<ApiRecord[]>([])
const handleSearch = (formData: Record<string, unknown> = {}) => {
  console.log(formData)
  const params = {
    ...pagination,
    ...formData
    // userId: formData?.userId || '',
    // minMoodScore: formData.emotionotionalScore,
    // maxMoodScore: formData.emotionotionalScore,
  }
  getEmotionalList(params).then(res => {
    console.log(res)
    tableData.value = res.records
    pagination.total = res.total
  })
}
const handleDelete = (row) => {
  console.log(row)
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    getEmotionalDelete(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}
// 详情
const detailVisible = ref(false)
const nowDetail = ref<ApiRecord | null>(null)
const aiData = ref<ApiRecord>({})
const handleDetail = (row: ApiRecord) => {
  console.log(row)
  if (row.aiEmotionAnalysis) {
    aiData.value = JSON.parse(row.aiEmotionAnalysis)
  } else {
    aiData.value = {}
  }
  console.log(row.aiEmotionAnalysis,aiData.value)
  nowDetail.value = row
  detailVisible.value = true
}
onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.detail-content {
  .detail-item {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>