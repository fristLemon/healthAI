<template>
  <div class="login-layout">
    <div class="title">
      <div class="back-home">
        <el-icon><back /></el-icon>
        <router-link to="/" style="color: #222;">返回首页</router-link>
      </div>
      <h1>登录您的账号</h1>
      <p>请输入您的账号和密码</p>
    </div>
    <el-form ref="formRef" 
      :model="formData" :rules="rules" label-position="top">
      <el-form-item label="用户名或邮箱" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password />
      </el-form-item>
      <el-button class="btn" type="primary" size="large" @click="handleSubmit(formRef)">登录</el-button>
    </el-form> 
    <div class="footer">
      <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
    </div> 
  </div>
 </template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { getLogin } from '@/api/admin'

  const router = useRouter()
  const formRef = ref()
  const formData = reactive({
    username: '',
    password: ''
  })
  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ]
  })
  const handleSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log(formData, fields)
        getLogin(formData).then(res => {
          if (!res.token) {
            return console.error('登录失败');
          }
          localStorage.setItem('token', res.token)
          localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
          if (res.userInfo.userType === 2) {
            router.push('/back/dashboard')
          } else {
            router.push('/')
          }
        })
      }
    })
  }
</script>

<style scoped>
.login-layout {
  width:384px;
  .title{
    margin-bottom: 30px;
    .back-home{
      margin-bottom: 50px;
    }
    h1{
      font-size: 30px;
      text-align: center;
      margin-bottom: 10px;
    }
    p{
      font-size: 14px;
      color: #999999;
      margin-bottom: 15px;
      text-align: center;
    }
  }
  .btn{
    width: 100%;
    margin-top: 20px;
  }
  .footer{
    margin-top: 20px;
    text-align: center;
  }
}
</style>

