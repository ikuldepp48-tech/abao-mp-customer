import { defineStore } from 'pinia';
import MenuApi from '@/sheep/api/restaurant/restaurant_menu';

const menu = defineStore({
  id: 'menu',
  state: () => ({
    storeInfo: null,       // 门店信息
    categories: [],        // 分类树（含菜品）
    combos: [],            // 套餐列表
    lastFetchTime: 0,      // 最后获取时间
    cacheMinutes: 5,       // 缓存有效期（分钟）
  }),
  getters: {
    // 缓存是否过期
    isExpired: (state) => {
      if (!state.lastFetchTime) return true;
      const now = Date.now();
      return (now - state.lastFetchTime) > state.cacheMinutes * 60 * 1000;
    },
    // 按 spuId 查找菜品
    getDishById: (state) => (spuId) => {
      for (const cat of state.categories) {
        const dishes = cat.dishes || cat.children || [];
        for (const dish of dishes) {
          if (dish.spuId === spuId) return dish;
        }
      }
      return null;
    },
  },
  actions: {
    // 获取菜单数据
    async fetchMenu(storeId) {
      // 缓存未过期则跳过
      if (!this.isExpired && this.storeInfo) {
        return { storeInfo: this.storeInfo, categories: this.categories, combos: this.combos };
      }

      const { code, data } = await MenuApi.getMenu(storeId);
      if (code !== 0) return null;

      this.storeInfo = data.store || data.storeInfo || null;
      this.categories = data.categories || [];
      this.combos = data.combos || [];
      this.lastFetchTime = Date.now();
      return data;
    },
    // 清空菜单缓存
    clearMenu() {
      this.storeInfo = null;
      this.categories = [];
      this.combos = [];
      this.lastFetchTime = 0;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'menu-store',
      },
    ],
  },
});

export default menu;
