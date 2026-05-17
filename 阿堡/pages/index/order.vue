<template>
  <view class="menu-page">
    <!-- Hero 头部 -->
    <view class="menu-hero">
      <AbaoNavBar :title="''" :dark="true" :showBack="isScanEntry" @back="goBack" />
      <view class="menu-hero-body">
        <view class="menu-hero-brand">
          <AbaoLogo size="lg" />
          <text class="menu-hero-store">{{ storeName || '阿堡' }}</text>
        </view>
        <view class="menu-search" @click="handleSearch">
          <text class="menu-search-icon">🔍</text>
          <text class="menu-search-placeholder">搜索菜品</text>
        </view>
      </view>
    </view>

    <!-- 桌台标签 -->
    <view class="table-bar" v-if="tableLabel">
      <AbaoChip variant="red" :text="tableLabel" />
    </view>

    <!-- 分类横向滚动 -->
    <scroll-view class="cat-pills-scroll" scroll-x :show-scrollbar="false" v-if="flatCategories.length">
      <view class="cat-pills-row">
        <view
          v-for="(cat, idx) in flatCategories"
          :key="idx"
          class="cat-pill"
          :class="{ active: activeCategory === idx }"
          @click="switchCategory(idx)"
        >
          <text class="cat-pill-text">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 菜品列表 -->
    <scroll-view
      v-if="!loading"
      class="dish-scroll"
      scroll-y
      :scroll-into-view="scrollToId"
      @scroll="onDishScroll"
      :scroll-with-animation="true"
      :style="{ height: dishScrollHeight + 'px' }"
    >
      <view
        v-for="(cat, catIdx) in flatCategories"
        :key="'sec-' + catIdx"
        class="cat-section"
        :id="'cat-' + catIdx"
      >
        <view class="category-title">
          <text class="category-title-text">{{ cat._parentName ? cat._parentName + ' · ' : '' }}{{ cat.name }}</text>
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

    <!-- 加载中 -->
    <view v-if="loading" style="padding: 0 28rpx;">
      <LoadingSkeleton variant="list" :count="4" />
    </view>

    <!-- 加载失败 -->
    <view v-if="loadError" class="error-view">
      <ErrorState errorType="network" retryText="重新加载" @retry="reloadMenu" />
    </view>

    <!-- 空状态：无菜单数据 -->
    <view v-if="!loading && !loadError && flatCategories.length === 0" class="empty-view">
      <EmptyState scenario="customer" icon="🍽️" title="暂无菜单数据" description="请先选择门店或联系管理员录入菜品" />
      <view class="empty-actions">
        <button class="empty-btn" @click="goSelectStore">选择门店</button>
        <button class="empty-btn empty-btn--secondary" @click="reloadMenu">重新加载</button>
      </view>
    </view>

    <!-- 底部购物车栏 -->
    <view class="cart-bar" @click="showCartPopup = true">
      <view class="cart-left">
        <view class="cart-icon" :class="{ 'has-items': cartStore.totalItems > 0 }">
          <text class="cart-icon-emoji">🛒</text>
          <view class="cart-badge" v-if="cartStore.totalItems > 0">
            <text class="cart-badge-text">{{ cartStore.totalItems }}</text>
          </view>
        </view>
        <view class="cart-info">
          <text class="cart-total" v-if="cartStore.totalItems > 0">¥{{ cartStore.totalPrice.toFixed(2) }}</text>
          <text class="cart-empty" v-else>购物车空空如也</text>
        </view>
      </view>
      <view class="cart-submit-btn" :class="{ disabled: cartStore.localIsEmpty }" @click.stop="goOrder">
        <text class="cart-submit-text">去结算</text>
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
            <su-image :src="item.coverUrl || '/static/logo.png'" :width="120" :height="120" borderRadius="12rpx" />
            <view class="cart-item-info">
              <text class="cart-item-name">{{ item.spuName }}</text>
              <text class="cart-item-sku" v-if="item.skuName">{{ item.skuName }}</text>
              <text class="cart-item-addons" v-if="item.addons && item.addons.length">
                {{ item.addons.map(a => a.name).join('、') }}
              </text>
              <view class="cart-item-bottom">
                <text class="cart-item-price">¥{{ item.unitPrice + (item.addons || []).reduce((s, a) => s + (a.extraPrice || 0), 0) }}</text>
                <view class="qty-ctrl">
                  <view class="qty-btn" @click="cartStore.decreaseQuantity(item.cartItemId)">−</view>
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

    <!-- 底部导航栏 -->
    <AbaoTabBar />
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import DishCard from './components/DishCard.vue';
import AddonModal from './components/AddonModal.vue';
import AbaoNavBar from '@/components/AbaoNavBar.vue';
import AbaoLogo from '@/components/AbaoLogo.vue';
import AbaoChip from '@/components/AbaoChip.vue';
import AbaoTabBar from '@/components/AbaoTabBar.vue';
import LoadingSkeleton from '@/components/LoadingSkeleton.vue';
import EmptyState from '@/components/EmptyState.vue';
import ErrorState from '@/components/ErrorState.vue';

const menuStore = sheep.$store('menu');
const storeStore = sheep.$store('store');
const tableStore = sheep.$store('table');
const cartStore = sheep.$store('cart');

const loading = ref(true);
const loadError = ref(false);
const categories = ref([]);
const combos = ref([]);
const activeCategory = ref(0);
const scrollToId = ref('');
const showCartPopup = ref(false);
const showAddonModal = ref(false);
const selectedDish = ref({});
const sectionTops = ref([]);
const dishScrollHeight = ref(0);

const storeName = computed(() => storeStore.storeName);
const tableLabel = computed(() => tableStore.tableLabel);

const isScanEntry = ref(false);

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

function goBack() {
  uni.navigateBack({ delta: 1 });
}

function goSelectStore() {
  uni.navigateTo({ url: '/pages/index/stores' });
}

async function reloadMenu() {
  loading.value = true;
  loadError.value = false;
  try {
    const storeId = storeStore.storeId || 3;
    const data = await menuStore.fetchMenu(storeId);
    if (data) {
      categories.value = data.categories || [];
      combos.value = data.combos || [];
    }
  } catch {
    loadError.value = true;
  }
  loading.value = false;
}

function handleSearch() {
  uni.navigateTo({ url: '/pages/index/search' });
}

onLoad(async (options) => {
  if (options && options.tableId) {
    isScanEntry.value = true;
  }
  try {
    const storeId = storeStore.storeId || 3;
    const data = await menuStore.fetchMenu(storeId);
    if (data) {
      categories.value = data.categories || [];
      combos.value = data.combos || [];
    }
  } catch {
    loadError.value = true;
  }
  loading.value = false;

  // 计算菜品列表可用高度（扣除顶部导航+hero+分类栏+购物车栏+tabbar）
  const sysInfo = uni.getSystemInfoSync();
  const statusBarH = sysInfo.statusBarHeight || 44;
  const navH = 44 + statusBarH;       // 导航栏 + 状态栏
  const heroH = 160;                    // Hero + 搜索栏
  const catBarH = 52;                   // 分类横滚条
  const cartBarH = 104;                 // 底部购物车栏
  const tabbarH = 100;                  // Tabbar
  dishScrollHeight.value = sysInfo.windowHeight - navH - heroH - catBarH - cartBarH - tabbarH;

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
  uni.showModal({
    title: '清空购物车',
    content: '确定要清空购物车吗？',
    success: (res) => {
      if (res.confirm) cartStore.clearLocalCart();
    },
  });
}
</script>

<style lang="scss" scoped>
.menu-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
}

/* ── Hero ── */
.menu-hero {
  background: linear-gradient(135deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
  flex-shrink: 0;
}

.menu-hero-body {
  padding: 0 28rpx 28rpx;
}

.menu-hero-brand {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.menu-hero-store {
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 800;
  color: #fff;
}

.menu-search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--r-pill);
  padding: 18rpx 28rpx;
}

.menu-search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.menu-search-placeholder {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* ── 桌台标签 ── */
.table-bar {
  padding: 16rpx 28rpx;
  background: var(--bg);
}

/* ── 分类药丸 ── */
.cat-pills-scroll {
  background: var(--bg);
  flex-shrink: 0;
  padding-bottom: 12rpx;
}

.cat-pills-row {
  display: flex;
  gap: 12rpx;
  padding: 0 28rpx;
  white-space: nowrap;
}

.cat-pill {
  display: inline-flex;
  padding: 12rpx 24rpx;
  border-radius: var(--r-pill);
  background: var(--ink-100);
  flex-shrink: 0;

  &.active {
    background: var(--abao-red);

    .cat-pill-text {
      color: #fff;
    }
  }
}

.cat-pill-text {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--ink-700);
}

/* ── 菜品列表 ── */
.dish-scroll {
  padding: 0 28rpx;
}

.cat-section {
  // 用于 selectorQuery 定位
}

.category-title {
  padding: 32rpx 0 20rpx;
}

.category-title-text {
  font-family: var(--font-display);
  font-size: 32rpx;
  font-weight: 800;
  color: var(--ink-900);
}

.bottom-placeholder {
  height: 160rpx;
}

.error-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.empty-actions {
  display: flex;
  gap: 20rpx;
}

.empty-btn {
  padding: 16rpx 36rpx;
  border-radius: var(--r-pill);
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  background: var(--abao-red);
  color: #fff;
  box-shadow: var(--shadow-red);

  &--secondary {
    background: #fff;
    color: var(--abao-red);
    border: 2rpx solid var(--abao-red);
    box-shadow: none;
  }
}

/* ── 底部购物车栏 ── */
.cart-bar {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  height: 104rpx;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-top: 0.5px solid var(--ink-200);
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.cart-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.cart-icon {
  width: 68rpx;
  height: 68rpx;
  background: var(--abao-red);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-red);
}

.cart-icon-emoji {
  font-size: 36rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #fff;
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--abao-red);
}

.cart-badge-text {
  font-size: 18rpx;
  color: var(--abao-red);
  font-weight: 700;
}

.cart-info {
  // cart info wrapper
}

.cart-total {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.cart-empty {
  font-size: 24rpx;
  color: var(--ink-500);
}

.cart-submit-btn {
  padding: 18rpx 44rpx;
  background: var(--abao-red);
  color: #fff;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-red);

  &.disabled {
    background: var(--ink-300);
    box-shadow: none;
  }
}

.cart-submit-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

/* ── 购物车弹窗 ── */
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
  border-bottom: 0.5px solid var(--ink-200);
}

.cart-popup-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink-900);
}

.cart-clear {
  font-size: 26rpx;
  color: var(--ink-500);
}

.cart-popup-body {
  flex: 1;
  padding: 0 20rpx;
}

.cart-popup-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 0.5px solid var(--ink-100);
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
  font-weight: 600;
  color: var(--ink-900);
}

.cart-item-sku {
  font-size: 22rpx;
  color: var(--ink-500);
}

.cart-item-addons {
  font-size: 20rpx;
  color: var(--ink-300);
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item-price {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.qty-ctrl {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.qty-btn {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 1px solid var(--ink-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--ink-700);
}

.qty-num {
  font-size: 28rpx;
  min-width: 36rpx;
  text-align: center;
  color: var(--ink-900);
}

.cart-empty-body {
  text-align: center;
  padding-top: 100rpx;
  font-size: 28rpx;
  color: var(--ink-500);
}
</style>
