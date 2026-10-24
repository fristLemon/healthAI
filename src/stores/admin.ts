import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
  },
})