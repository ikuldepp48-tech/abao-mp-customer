import { defineStore } from 'pinia';

const store = defineStore({
  id: 'store',
  state: () => ({
    storeId: null,        // 当前门店ID
    storeName: '',        // 当前门店名称
  }),
  getters: {
    hasStore: (state) => !!state.storeId,
  },
  actions: {
    setStore(storeId, storeName) {
      this.storeId = storeId;
      this.storeName = storeName;
    },
    clearStore() {
      this.storeId = null;
      this.storeName = '';
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'store-store',
      },
    ],
  },
});

export default store;
