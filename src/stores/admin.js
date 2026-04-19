import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore= defineStore('admin', () => {
  const isOpen = ref(false)
  const toggleOpen= ()=>{
    isOpen.value= !isOpen.value
  }
  return {
    isOpen,
    toggleOpen,
  }
});