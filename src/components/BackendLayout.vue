<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<template>
  <div class="backend-layout">
    <el-container class="main-box">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main>
          <router-view class="content-container" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-box {
    height: 100%;
    .el-header {
      height: 74px !important;
    }
  }
  .content-container {
    min-height: calc(100% - 30px);
    padding: 15px;
    background: #fff;
  }
}
</style>
