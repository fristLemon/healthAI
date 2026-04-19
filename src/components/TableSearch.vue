<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  fromItem: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['search'])

const formRef = ref()
// 定义表单数据
const formData = reactive({})
// 初始化表单数据
const fromItemAtrrs = computed(() => {
  const {fromItem} = props
  fromItem.forEach(item => {
    item.col = { xs:24, sm:12, md:8, lg:6, xl:6 }
  })
  return fromItem
})

const isComp = (type) => {
  return {
    input: 'elInput',
    select: 'elSelect',
  }[type]
}
const handleSearch = () => {
  emit('search', formData)
}
const handleReset = (formEl) => {
  if(!formEl) return;
  formEl.resetFields()
  emit('search', formData)
}
</script>

<template>
  <el-form ref="formRef" :model="formData">
    <el-row :gutter="24">
      <template v-for="item in fromItemAtrrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component :is="isComp(item.type)" v-model="formData[item.prop]" :placeholder="item.placeholder">
              <template v-if="item.type === 'select'">
                <el-option label="全部" value="" />
                <el-option v-for="option in item.options" :key="option.value" 
                  :label="option.label" :value="option.value" />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="24">
      <el-col>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset(formRef)">重置</el-button>
      </el-col>
    </el-row>
  </el-form>  
</template>
