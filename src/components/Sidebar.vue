<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
const adminStore = useAdminStore()
const router = useRouter()
console.log('router---', router);

const sidebarlogo = new URL('@/assets/images/机器人.png', import.meta.url).href
const isOpen = computed(() => adminStore.isOpen)
const handleMenu = (key) => {
  console.log(key)
  const currouter = router.options.routes[0].path;
  router.push(`${currouter}/${key.index}`)
}
</script>

<template>
  <el-aside :width="isOpen ? '64px' : '264px'">
    <el-menu
      default-active="dashboard"
      class="menu-style"
      :collapse="isOpen"
      :collapse-transition="false"
    >
      <div class="brand">
        <el-image style="width: 50px; height: 50px;" :src="sidebarlogo" alt="logo" />
        <div v-show="!isOpen" class="brand-info">
          <h1>心理健康AI助手</h1>
          <p>管理后台</p>
        </div>
      </div>
      <el-menu-item v-for="item in router.options.routes[0].children" :key="item.name"
      @click="handleMenu"
      :index="String(item.name)">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.menu-style {
  height: 100%;
}
.brand{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
  .brand-info{
    margin-left: 10px;
    h1{
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 5px;
    }
    p{
      font-size: 14px;
      color: #6b6b70;
    }
  }
}
</style>
