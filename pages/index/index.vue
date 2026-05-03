<template>
  <view class="menu-page">
    <!-- 顶部门店信息 -->
    <view class="menu-header">
      <view class="header-left">
        <text class="store-name">{{ storeName || '阿堡' }}</text>
        <text class="table-info" v-if="tableLabel">{{ tableLabel }}</text>
      </view>
      <view class="header-right">
        <text class="search-icon">&#x2315;</text>
      </view>
    </view>

    <!-- Banner 轮播 -->
    <view class="banner-area" v-if="banners.length">
      <su-swiper
        :list="banners"
        dotStyle="tag"
        :autoplay="true"
        :interval="3000"
        :height="240"
        imageMode="aspectFill"
      />
    </view>

    <!-- 主体：左侧分类 + 右侧菜品 -->
    <view class="menu-body" v-if="!loading">
      <!-- 左侧分类列 -->
      <scroll-view class="sidebar" scroll-y>
        <view
          v-for="(cat, idx) in flatCategories"
          :key="idx"
          class="sidebar-item"
          :class="{ active: activeCategory === idx }"
          @click="switchCategory(idx)"
        >
          <view class="sidebar-bar" v-if="activeCategory === idx" />
          <text class="sidebar-name">{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧菜品列表 -->
      <scroll-view
        class="dish-scroll"
        scroll-y
        :scroll-into-view="scrollToId"
        @scroll="onDishScroll"
        :scroll-with-animation="true"
      >
        <view
          v-for="(cat, catIdx) in flatCategories"
          :key="'sec-' + catIdx"
          class="cat-section"
          :id="'cat-' + catIdx"
        >
          <view class="category-title">
            {{ cat._parentName ? cat._parentName + ' · ' : '' }}{{ cat.name }}
          </view>
          <DishCard
            v-for="dish in cat.dishes"
            :key="dish.spuId"
            :dish="dish"
            @add="quickAdd"
          />
        </view>
        <view class="bottom-placeholder" />
      </scroll-view>
    </view>

    <!-- 加载中 -->
    <view class="loading-view" v-if="loading">
      <text>加载菜单中...</text>
    </view>

    <!-- 底部购物车栏 -->
    <view class="cart-bar" @click="showCartPopup = true">
      <view class="cart-left">
        <view class="cart-icon" :class="{ 'has-items': cartStore.totalItems > 0 }">
          <text class="cart-icon-text">&#x1F6D2;</text>
          <text class="cart-badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</text>
        </view>
        <text class="cart-total" v-if="cartStore.totalItems > 0">¥{{ cartStore.totalPrice.toFixed(2) }}</text>
        <text class="cart-empty" v-else>购物车空空如也</text>
      </view>
      <view class="cart-submit-btn" :class="{ disabled: cartStore.localIsEmpty }" @click.stop="goOrder">
        去结算
      </view>
    </view>

    <!-- 购物车弹窗 -->
    <su-popup :show="showCartPopup" type="bottom" @close="showCartPopup = false" :height="'60vh'">
      <view class="cart-popup">
        <view class="cart-popup-header">
          <text class="cart-popup-title">购物车（{{ cartStore.totalItems }}件）</text>
          <text class="cart-clear" @click="handleClearCart">清空</text>
        </view>
        <scroll-view class="cart-popup-body" scroll-y>
          <view class="cart-popup-item" v-for="item in cartStore.localItems" :key="item.cartItemId">
            <su-image :src="item.coverUrl || '/static/logo.png'" :width="120" :height="120" borderRadius="8rpx" />
            <view class="cart-item-info">
              <text class="cart-item-name">{{ item.spuName }}</text>
              <text class="cart-item-sku" v-if="item.skuName">{{ item.skuName }}</text>
              <text class="cart-item-addons" v-if="item.addons && item.addons.length">
                {{ item.addons.map(a => a.name).join('、') }}
              </text>
              <view class="cart-item-bottom">
                <text class="cart-item-price">¥{{ item.unitPrice + (item.addons || []).reduce((s, a) => s + (a.extraPrice || 0), 0) }}</text>
                <view class="qty-ctrl">
                  <view class="qty-btn" @click="cartStore.decreaseQuantity(item.cartItemId)">-</view>
                  <text class="qty-num">{{ item.quantity }}</text>
                  <view class="qty-btn" @click="cartStore.increaseQuantity(item.cartItemId)">+</view>
                </view>
              </view>
            </view>
          </view>
          <view class="cart-empty-body" v-if="cartStore.localIsEmpty">
            <text>购物车是空的，快去点菜吧</text>
          </view>
        </scroll-view>
      </view>
    </su-popup>

    <!-- 加料弹窗 -->
    <AddonModal
      :visible="showAddonModal"
      :dish="selectedDish"
      @close="showAddonModal = false"
      @confirm="showAddonModal = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import DishCard from './components/DishCard.vue';
import AddonModal from './components/AddonModal.vue';

const menuStore = sheep.$store('menu');
const storeStore = sheep.$store('store');
const tableStore = sheep.$store('table');
const cartStore = sheep.$store('cart');

const loading = ref(true);
const categories = ref([]);
const combos = ref([]);
const activeCategory = ref(0);
const scrollToId = ref('');
const showCartPopup = ref(false);
const showAddonModal = ref(false);
const selectedDish = ref({});
const sectionTops = ref([]); // 各分类区域的偏移量（用于滚动联动）

const storeName = computed(() => storeStore.storeName);
const tableLabel = computed(() => tableStore.tableLabel);

const banners = ref([
  { type: 'image', src: '/static/logo.png' },
  { type: 'image', src: '/static/logo.png' },
]);

// 展平分类树
const flatCategories = computed(() => {
  const result = [];
  for (const cat of categories.value) {
    if (cat.children && cat.children.length > 0) {
      for (const child of cat.children) {
        if (child.dishes && child.dishes.length > 0) {
          result.push({ ...child, _parentName: cat.name });
        }
      }
    } else if (cat.dishes && cat.dishes.length > 0) {
      result.push(cat);
    }
  }
  return result;
});

onLoad(async () => {
  const storeId = storeStore.storeId || 3;
  const data = await menuStore.fetchMenu(storeId);
  if (data) {
    categories.value = data.categories || [];
    combos.value = data.combos || [];
  }
  loading.value = false;
  // 等 DOM 渲染后计算各分类区域位置
  await nextTick();
  setTimeout(() => calcSectionTops(), 300);
});

function calcSectionTops() {
  const query = uni.createSelectorQuery();
  query.selectAll('.cat-section').boundingClientRect((rects) => {
    if (rects && rects.length) {
      sectionTops.value = rects.map(r => r.top);
    }
  }).exec();
}

function onDishScroll(e) {
  const st = e.detail.scrollTop;
  const tops = sectionTops.value;
  if (!tops.length) return;
  let active = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= st + 60) {
      active = i;
    } else {
      break;
    }
  }
  if (active !== activeCategory.value) {
    activeCategory.value = active;
  }
}

function switchCategory(idx) {
  activeCategory.value = idx;
  scrollToId.value = 'cat-' + idx;
}

function goDetail(dish) {
  uni.navigateTo({ url: '/pages/dish/detail?spuId=' + dish.spuId });
}

function quickAdd(dish) {
  if ((!dish.skus || dish.skus.length <= 1) && (!dish.addons || dish.addons.length === 0)) {
    const sku = (dish.skus && dish.skus.length === 1) ? dish.skus[0] : { id: 0, name: '', price: dish.minPrice || 0 };
    cartStore.addItem({
      spuId: dish.spuId,
      spuName: dish.name,
      coverUrl: dish.coverUrl,
      skuId: sku.id,
      skuName: sku.name,
      unitPrice: sku.price,
      addons: [],
      remark: '',
      quantity: 1,
    });
    uni.showToast({ title: '已加入', icon: 'none', duration: 1000 });
  } else {
    selectedDish.value = dish;
    showAddonModal.value = true;
  }
}

function goOrder() {
  if (cartStore.localIsEmpty) return;
  showCartPopup.value = false;
  uni.navigateTo({ url: '/pages/order/confirm' });
}

function handleClearCart() {
  cartStore.clearLocalCart();
}
</script>

<style lang="scss" scoped>
.menu-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f6f6f6;
}

/* 顶部 */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 30rpx;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
}

.store-name {
  font-size: 36rpx;
  font-weight: bold;
  color: $dark-3;
}

.table-info {
  font-size: 24rpx;
  color: $red;
}

.search-icon {
  font-size: 40rpx;
  color: $dark-6;
}

.banner-area {
  padding: 0 20rpx 12rpx;
  background: #fff;
}

/* 主体：flex 横向 */
.menu-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧分类列 */
.sidebar {
  width: 180rpx;
  background: #f8f8f8;
  flex-shrink: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 28rpx 20rpx;
  position: relative;

  &.active {
    background: #fff;

    .sidebar-name {
      color: $red;
      font-weight: bold;
    }
  }
}

.sidebar-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4rpx;
  height: 32rpx;
  background: $red;
  border-radius: 0 3rpx 3rpx 0;
}

.sidebar-name {
  font-size: 26rpx;
  color: $dark-6;
  line-height: 1.3;
  word-break: keep-all;
}

/* 右侧菜品列表 */
.dish-scroll {
  flex: 1;
  padding: 0 20rpx;
}

.cat-section {
  // 用于 selectorQuery 定位
}

.category-title {
  padding: 24rpx 10rpx 16rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: $dark-3;
}

.bottom-placeholder {
  height: 140rpx;
}

/* 加载中 */
.loading-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: $dark-9;
}

/* 底部购物车栏 */
.cart-bar {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-top: 1rpx solid #eee;
  z-index: 100;
}

.cart-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.cart-icon {
  width: 64rpx;
  height: 64rpx;
  background: $red;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &.has-items {
    background: $red;
  }
}

.cart-icon-text {
  font-size: 36rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #fff;
  color: $red;
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  font-size: 20rpx;
  text-align: center;
  line-height: 32rpx;
  border: 2rpx solid $red;
}

.cart-total {
  font-size: 30rpx;
  font-weight: bold;
  color: $red;
}

.cart-empty {
  font-size: 26rpx;
  color: $dark-9;
}

.cart-submit-btn {
  padding: 16rpx 40rpx;
  background: $red;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;

  &.disabled {
    background: #ccc;
  }
}

/* 购物车弹窗 */
.cart-popup {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.cart-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.cart-popup-title {
  font-size: 30rpx;
  font-weight: bold;
}

.cart-clear {
  font-size: 26rpx;
  color: $dark-9;
}

.cart-popup-body {
  flex: 1;
  padding: 0 20rpx;
}

.cart-popup-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.cart-item-info {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-name {
  font-size: 28rpx;
  font-weight: bold;
  color: $dark-3;
}

.cart-item-sku {
  font-size: 22rpx;
  color: $dark-9;
}

.cart-item-addons {
  font-size: 20rpx;
  color: $dark-a;
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item-price {
  font-size: 28rpx;
  font-weight: bold;
  color: $red;
}

.qty-ctrl {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.qty-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid #ddd;
  text-align: center;
  line-height: 40rpx;
  font-size: 28rpx;
}

.qty-num {
  font-size: 28rpx;
  min-width: 36rpx;
  text-align: center;
}

.cart-empty-body {
  text-align: center;
  padding-top: 100rpx;
  font-size: 28rpx;
  color: $dark-9;
}
</style>
