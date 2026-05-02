import { defineStore } from 'pinia';
import CartApi from '@/sheep/api/trade/cart';

// 生成购物车项唯一标识
function calcCartHash(item) {
  const addonIds = (item.addons || []).map(a => a.id).sort().join(',');
  return `${item.spuId}_${item.skuId}_${addonIds}_${item.remark || ''}`;
}

const cart = defineStore({
  id: 'cart',
  state: () => ({
    list: [], // 购物车列表（invalidList + validList）
    selectedIds: [], // 已选列表
    isAllSelected: false, // 是否全选
    totalPriceSelected: 0, // 选中项总金额
    newList: [], // 除去已下架的购物车列表（validList）
    editMode: false, // 是否是编辑模式
    // 餐厅本地购物车
    localItems: [],
  }),
  getters: {
    totalItems: (state) => state.localItems.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.localItems.reduce((sum, i) => sum + (i.unitPrice + (i.addons || []).reduce((s, a) => s + (a.extraPrice || 0), 0)) * i.quantity, 0),
    localIsEmpty: (state) => state.localItems.length === 0,
  },
  actions: {
    // 获取购物车列表
    async getList() {
      const { data, code } = await CartApi.getCartList();
      if (code === 0) {
        this.list = [...data.validList, ...data.invalidList];
        this.newList = data.validList;

        // 计算各种关联属性
        this.selectedIds = [];
        this.isAllSelected = true;
        this.totalPriceSelected = 0;
        (this.editMode ? this.list : this.newList).forEach((item) => {
          if (item.selected) {
            this.selectedIds.push(item.id);
            this.totalPriceSelected += item.count * item.sku?.price;
          } else {
            this.isAllSelected = false;
          }
        });
      }
    },

    onChangeEditMode(flag) {
      this.editMode = flag;
      this.selectedIds = [];
      this.getList();
    },

    // 添加购物车
    async add(goodsInfo) {
      // 添加购物项
      const { code } = await CartApi.addCart({
        skuId: goodsInfo.id,
        count: goodsInfo.goods_num,
      });
      // 刷新购物车列表
      if (code === 0) {
        await this.getList();
      }
    },

    // 更新购物车
    async update(goodsInfo) {
      const { code } = await CartApi.updateCartCount({
        id: goodsInfo.goods_id,
        count: goodsInfo.goods_num,
      });
      if (code === 0) {
        await this.getList();
      }
    },

    // 移除购物车
    async delete(ids) {
      let idsTemp = '';
      if (Array.isArray(ids)) {
        idsTemp = ids.join(',');
      } else {
        idsTemp = ids;
      }
      const { code } = await CartApi.deleteCart(idsTemp);
      if (code === 0) {
        await this.getList();
      }
    },

    // 单选购物车商品
    async selectSingle(goodsId) {
      const { code } = await CartApi.updateCartSelected({
        ids: [goodsId],
        selected: !this.selectedIds.includes(goodsId), // 取反
      });
      if (code === 0) {
        await this.getList();
      }
    },

    // 全选购物车商品
    async selectAll(flag) {
      const { code } = await CartApi.updateCartSelected({
        ids: this.list.map((item) => item.id),
        selected: flag,
      });
      if (code === 0) {
        await this.getList();
      }
    },

    // 清空购物车。注意，仅用于用户退出时，重置数据
    emptyList() {
      this.list = [];
      this.selectedIds = [];
      this.isAllSelected = true;
      this.totalPriceSelected = 0;
      this.localItems = [];
    },

    // 本地购物车 - 添加菜品
    addItem(item) {
      const hash = calcCartHash(item);
      const existing = this.localItems.find(i => calcCartHash(i) === hash);
      if (existing) {
        existing.quantity += (item.quantity || 1);
      } else {
        this.localItems.push({ ...item, cartItemId: Date.now().toString(), quantity: item.quantity || 1 });
      }
    },

    // 本地购物车 - 移除菜品
    removeItem(cartItemId) {
      const idx = this.localItems.findIndex(i => i.cartItemId === cartItemId);
      if (idx >= 0) this.localItems.splice(idx, 1);
    },

    // 本地购物车 - 增减数量
    increaseQuantity(cartItemId) {
      const item = this.localItems.find(i => i.cartItemId === cartItemId);
      if (item) item.quantity++;
    },

    decreaseQuantity(cartItemId) {
      const item = this.localItems.find(i => i.cartItemId === cartItemId);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) this.removeItem(cartItemId);
      }
    },

    // 本地购物车 - 清空
    clearLocalCart() {
      this.localItems = [];
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart-store',
      },
    ],
  },
});

export default cart;
