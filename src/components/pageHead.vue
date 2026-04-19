<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  }
})
</script>

<template>
  <div class="page-head">
    <p class="title">{{ title }}</p>
    <div class="action-btn">
      <slot name="buttons" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .title {
    font-size: 24px;
    color: #2d2d2d;
  }
}
</style>
