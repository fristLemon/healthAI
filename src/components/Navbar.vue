<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="toggleOpen">
        <el-icon>
          <Expand />
        </el-icon>
      </el-button>
      <p class="title">{{route.meta.title}}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="头像" />
          <p class="user-name">admin</p>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>  
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLogout } from '@/api/admin'
const route = useRoute()
const router = useRouter()

const adminStore = useAdminStore()
const handleCommand = (command) => {
  console.log(command)
  if(command === 'logout'){
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(()=>{  
      getLogout().then(()=>{
        ElMessage.success('退出登录成功')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/auth/login')
      })
    })
  }
}
const toggleOpen = () => {
  adminStore.toggleOpen()
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
}
.flex-box {
  display: flex;
  align-items: center;
    .title{
      font-size: 26px;
      font-weight: bold;
      color: #1f2937;
      margin-left: 20px;
    }
    .user-name {
        margin: 0 5px;
        font-weight: bold;
    }
}
</style>
