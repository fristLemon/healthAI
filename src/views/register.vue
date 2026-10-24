<template>
  <div class="register-layout">
    <div class="title">
      <div class="title-text">
        <h1>创建您的账号</h1>
        <p>请输入注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" placeholder="请输入确认密码" type="password" show-password />
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="handleSubmit(formRef)">创建用户</el-button>
      </el-form> 
      <div class="footer">
        <p>已有账号？<router-link to="/auth/login">立即登录</router-link></p>
      </div> 
    </div>
  </div>
 </template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { register } from '@/api/frontend'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  const formRef = ref()
  const formData = reactive({
    username: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: 0,
    userType: 1 // 前台
  })
  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' }
    ],
  })
  const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        console.log(formData)
        register(formData).then(res => {
          console.log('res---', res)
          const {data} = res
          if (data.code === '200') {
            ElMessage.success('注册成功')
            router.push('/auth/login')
          } else {
            ElMessage.error(data.msg)
          }  
        })
      }
    })
  }
</script>

<style lang="scss" scoped>
.register-layout {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>

