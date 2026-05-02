<template>
  <view class="menu-page">
    <!-- 顶部门店信息 -->
    <view class="menu-header">
      <view class="header-top">
        <text class="store-name" v-if="storeName">{{ storeName }}</text>
        <text class="table-info" v-if="tableLabel">{{ tableLabel }}</text>
        <text class="store-name" v-else>阿堡</text>
      </view>
      <!-- Banner 轮播 -->
      <view class="banner-area" v-if="banners.length">
        <su-swiper
          :list="banners"
          dotStyle="tag"
          :autoplay="true"
          :interval="3000"
          :height="280"
          imageMode="aspectFill"
        />
      </view>
    </view>

    <!-- 主体：横向分类 tabs（sticky） + 菜品列表 -->
    <view class="menu-body" v-if="!loading">
      <!-- 横向分类 tabs（吸顶） -->
      <su-sticky>
        <su-tabs
          :list="tabList"
          :current="activeCategory"
          :scrollable="true"
          :activeStyle="{ color: '#D4351C', fontWeight: 'bold' }"
          :inactiveStyle="{ color: '#666666' }"
          lineColor="#D4351C"
          :lineWidth="20"
          :lineHeight="3"
          @change="onTabChange"
        />
      </su-sticky>

      <!-- 菜品列表 -->
      <scroll-view
        class="dish-list"
        scroll-y
        :scroll-into-view="scrollToId"
        @scroll="onDishScroll"
      >
        <view v-for="(cat, catIdx) in flatCategories" :key="'cat-' + catIdx" :id="'cat-' + catIdx">
          <view class="category-title">{{ cat._parentName ? cat._parentName + ' · ' : '' }}{{ cat.name }}</view>
          <view
            v-for="(dish, dishIdx) in (cat.dishes || [])"
            :key="'dish-' + dishIdx"
            class="dish-card"
            @click="goDetail(dish)"
          >
            <su-image
              :src="dish.coverUrl || '/static/logo.png'"
              :width="160"
              :height="160"
              borderRadius="12rpx"
            />
            <view class="dish-info">
              <text class="dish-name">{{ dish.name }}</text>
              <text class="dish-desc" v-if="dish.subtitle">{{ dish.subtitle }}</text>
              <view class="dish-price-row">
                <text class="dish-price">¥{{ dish.minPrice }}</text>
                <view class="dish-add-btn" @click.stop="quickAdd(dish)">+</view>
              </view>
            </view>
          </view>
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
          <text class="cicon-cart cart-icon-font" />
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
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow, onHide } from '@dcloudio/uni-app';
import sheep from '@/sheep';

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

const storeName = computed(() => storeStore.storeName);
const tableLabel = computed(() => tableStore.tableLabel);

// Banner 数据（静态占位，后续接入后端 API）
const banners = ref([
  { type: 'image', src: '/static/logo.png' },
  { type: 'image', src: '/static/logo.png' },
]);

// 展平分类树：父分类有子分类时展开子分类，只显示有菜品的分类
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

// su-tabs 的 list 数据格式
const tabList = computed(() =>
  flatCategories.value.map((cat) => ({ name: cat.name }))
);

onLoad(async () => {
  const storeId = storeStore.storeId || 3;
  const data = await menuStore.fetchMenu(storeId);
  if (data) {
    categories.value = data.categories || [];
    combos.value = data.combos || [];
  }
  loading.value = false;
});

onShow(() => {
  // 不再隐藏 tabBar，底部导航栏始终可见
});

onHide(() => {
  // 不再需要恢复 tabBar
});

function onTabChange(e) {
  const idx = e.index;
  activeCategory.value = idx;
  scrollToId.value = 'cat-' + idx;
}

function switchCategory(idx) {
  activeCategory.value = idx;
  scrollToId.value = 'cat-' + idx;
}

function onDishScroll(e) {
  // 暂不实现自动高亮
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
    goDetail(dish);
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
  background: $bg-page;
}

.menu-header {
  background: #fff;
}

.header-top {
  padding: 20rpx 30rpx;
}

.store-name {
  font-size: 36rpx;
  font-weight: bold;
  color: $dark-3;
}

.table-info {
  font-size: 24rpx;
  color: $red;
  margin-left: 16rpx;
}

.banner-area {
  padding: 0 20rpx 16rpx;
}

.menu-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.dish-list {
  flex: 1;
  padding: 0 20rpx;
}

.category-title {
  padding: 24rpx 10rpx 16rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: $dark-3;
}

.dish-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.dish-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-name {
  font-size: 28rpx;
  font-weight: bold;
  color: $dark-3;
}

.dish-desc {
  font-size: 22rpx;
  color: $dark-9;
  margin-top: 4rpx;
}

.dish-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-price {
  font-size: 30rpx;
  font-weight: bold;
  color: $red;
}

.dish-add-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: $red;
  color: #fff;
  font-size: 32rpx;
  line-height: 48rpx;
  text-align: center;
}

.bottom-placeholder {
  height: 140rpx;
}

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

.cart-total {
  font-size: 30rpx;
  font-weight: bold;
  color: $red;
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

.cart-icon-font {
  font-size: 36rpx;
  color: #fff;
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

.cart-empty {
  font-size: 26rpx;
  color: $dark-9;
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

.qty-ctrl .qty-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid #ddd;
  text-align: center;
  line-height: 40rpx;
  font-size: 28rpx;
}

.qty-ctrl .qty-num {
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
