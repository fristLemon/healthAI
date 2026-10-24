<template>
  <div class="consultation">
    <PageHead title="咨询记录"></PageHead>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="会话ID" width="200">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="情绪标签">
        <template #default="scope">
          <div class="emotion-tit">{{scope.row.sessionTitle}}</div>
          <div class="emotion-tag">{{scope.row.lastMessageContent}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100"></el-table-column>
      <el-table-column prop="lastMessageTime" label="时间" width="180"></el-table-column>
      <el-table-column width="100" label="操作" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
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
    <el-dialog v-model="dialogVisible" title="咨询会话详情" width="70%" :close-on-click-modal="false">
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div> <p class="detail-value">{{detailData.userNickname}}</p>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div> <p class="detail-value">{{detailData.lastMessageTime}}</p>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div> <p class="detail-value">{{detailData.messageCount}}</p>
          </div>
        </div>
      <div class="messages-container">
          <div class="messages-header"> 
            <h4>对话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMsg"> 
            <div v-for="item in detailMessages" :key="item.id" class="message-item"
              :class="item.senderType === 1 ? 'user-message' : 'ai-message'">
              <div class="message-header">
                <span class="sender">{{ item.senderType === 1 ? '用户' : 'ai助手' }}</span>
                <span class="time">{{ item.createdAt }}</span>
              </div>
              <div class="message-content"> {{item.content}}</div>  
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHead from '@/components/pageHead.vue'
import { getSessionsList, getSessionDetail } from '@/api/admin'
import type { ApiRecord, ChatSession } from '@/types'

const tableData = ref<ChatSession[]>([])
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
})
const handleChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}
const handleSearch = () => {
  getSessionsList(pagination).then(res => {
    const {records, total} = res
    tableData.value = records
    pagination.total = total
  })
}

const dialogVisible = ref(false)
const detailData = ref<ApiRecord>({})
const detailMessages = ref<ApiRecord[]>([])
const loadingMsg = ref(false)
const handleDetail = (row: ChatSession) => {
  console.log(row)
  loadingMsg.value = true
  dialogVisible.value = true
  getSessionDetail(row.id).then(res => {
    detailMessages.value = res
    detailData.value = row
    loadingMsg.value = false
  })
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
 .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>
