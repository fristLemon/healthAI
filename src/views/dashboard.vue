<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card v-if="analyticsOverview.systemOverview">
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width: 40px; height: 40px" :src="url1"></el-image>
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{analyticsOverview.systemOverview.totalUsers}}</p>
              <p class="subtitle-title">活跃用户：{{analyticsOverview.systemOverview.activeUsers}}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsOverview.systemOverview">
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width: 40px; height: 40px" :src="url2"></el-image>
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{analyticsOverview.systemOverview.totalDiaries}}</p>
              <p class="subtitle-title">今日新增：{{analyticsOverview.systemOverview.todayNewDiaries}}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsOverview.systemOverview">
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width: 40px; height: 40px" :src="url3"></el-image>
            </div>
            <div class="info">
              <p class="title">资讯会话</p>
              <p class="number">{{analyticsOverview.systemOverview.totalSessions}}</p>
              <p class="subtitle-title">今日新增：{{analyticsOverview.systemOverview.todayNewSessions}}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analyticsOverview.systemOverview">
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width: 40px; height: 40px" :src="url4"></el-image>
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{analyticsOverview.systemOverview.avgMoodScore}}</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 300px;"></div>
          </div>  
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">资讯会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats" v-if="analyticsOverview.consultationStats">
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">{{analyticsOverview.consultationStats.totalSessions}}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">{{analyticsOverview.consultationStats.avgDurationMinutes}}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{analyticsOverview.systemOverview.activeUsers}}</div>
              </div>
            </div>
            <div ref="consultationChartRef" style="width: 100%; height: 260px;"></div>
          </div>  
        </el-card>
      </el-col>
    </el-row> 
    <el-row :gutter="24" style="margin-top: 20px;">
      <el-col>
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">用户活跃度趋势</div>
          </template>
          <div class="chart-content">
            <div ref="userChartRef" style="width: 100%; height: 300px;"></div>
          </div> 
        </el-card>
      </el-col>
    </el-row>   
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getDataAnalyticsOverview } from '@/api/admin'
import * as echarts from 'echarts'
import type { ApiRecord } from '@/types'
const analyticsOverview = ref<ApiRecord>({})
const url1 = new URL('@/assets/images/users.png', import.meta.url).href
const url2 = new URL('@/assets/images/like.png', import.meta.url).href
const url3 = new URL('@/assets/images/comments.png', import.meta.url).href
const url4 = new URL('@/assets/images/smile.png', import.meta.url).href

let emotionChart: echarts.ECharts | null = null
const emotionChartRef = ref<HTMLElement | null>(null)
const initCharts = () => {
  initEmotionChart()
  initConsultationChart()
  initUserChart()
}
const initEmotionChart = () => {
  if (!emotionChartRef.value) return
  if (emotionChart) {
    emotionChart.dispose()
  }
  emotionChart = echarts.init(emotionChartRef.value)
  const trendData = analyticsOverview.value.emotionTrend
  const option = {
    title: {
      text: '情绪趋势分析',
      textStyle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#2d3e50',
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fabla8',
      borderWidth: 1,
      textStyle: {
        color: '#2d436',
      },
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40
    },
    grid: {
      top: 80,
      bottom: 20,
      left: '3%',
      right: '4%',
    },
    xAxis: {
      type: 'category',
      data: trendData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#2d3436',
        },
      },
    },
    yAxis: [{
      type: 'value',
      name: '情绪评分',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: '#2d3436',
        },
      },
    },{
      type: 'value',
      name: '记录数量',
      position: 'right',
      axisLine: {
        lineStyle: {
          color: '#2d3436',
        },
      },
    }],
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: trendData.map(item => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#faebaf',
        },
        itemStyle: {
          color: '#faebaf',
        },
      },
      {
        name: '记录数量',
        type: 'line',
        data: trendData.map(item => item.recordCount),
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#eeba43',
        },
        itemStyle: {
          color: '#eeba43',
        },
      },
    ]
  }
  emotionChart.setOption(option)
}
const consultationChartRef = ref<HTMLElement | null>(null)
let consultationChart: echarts.ECharts | null = null
const initConsultationChart = () => {
  if (!consultationChartRef.value) return
  if (consultationChart) {
    consultationChart.dispose()
  }
  consultationChart = echarts.init(consultationChartRef.value)
  const dailyTrend = analyticsOverview.value.consultationStats.dailyTrend
  const option = {
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dailyTrend.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: dailyTrend.map(item => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: dailyTrend.map(item => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  }
  consultationChart.setOption(option)
}
const userChartRef = ref<HTMLElement | null>(null)
let userChart: echarts.ECharts | null = null
const initUserChart = () => {
  if (!userChartRef.value) return
  if (userChart) {
    userChart.dispose()
  }
  userChart = echarts.init(userChartRef.value)
  const activityData = analyticsOverview.value.userActivity
  const option = {
    title: {
      text: '用户活跃度趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: activityData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: activityData.map(item => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#a29bfe'
        },
        itemStyle: {
          color: '#a29bfe'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
              { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
            ]
          }
        }
      },
      {
        name: '新增用户',
        type: 'line',
        data: activityData.map(item => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fdcb6e'
        },
        itemStyle: {
          color: '#fdcb6e'
        }
      },
      {
        name: '日记用户',
        type: 'line',
        data: activityData.map(item => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#00b894'
        },
        itemStyle: {
          color: '#00b894'
        }
      },
      {
        name: '咨询用户',
        type: 'line',
        data: activityData.map(item => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fab1a0'
        },
        itemStyle: {
          color: '#fab1a0'
        }
      }
    ]
  }
  userChart.setOption(option)
}

onMounted(() => {
  getDataAnalyticsOverview().then(res => {
    analyticsOverview.value = res
    initCharts()
  })
})
</script>

<style scoped lang="scss">
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }
</style>
