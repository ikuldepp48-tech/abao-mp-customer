<template>
  <view class="cart-page">
    <AbaoNavBar title="购物车" />

    <!-- 加载中 -->
    <view v-if="loading" style="padding: 0 28rpx;">
      <LoadingSkeleton variant="list" :count="3" />
    </view>

    <!-- 加载失败 -->
    <view v-if="loadError" class="error-view">
      <ErrorState errorType="network" retryText="重新加载" @retry="retryLoad" />
    </view>

    <!-- 空购物车 -->
    <view v-if="!loading && !loadError && state.list.length === 0" class="empty-view">
      <EmptyState
        scenario="customer"
        icon="🛒"
        title="购物车空空如也"
        description="快去逛逛吧~"
      />
      <view class="empty-actions">
        <button class="empty-btn" @click="goHome">去逛逛</button>
      </view>
    </view>

    <!-- 购物车内容 -->
    <view v-if="!loading && !loadError && state.list.length" class="cart-body">
      <!-- 头部：商品数 + 编辑 -->
      <view class="cart-header">
        <text class="cart-header-count">共 <text class="count-num">{{ state.list.length }}</text> 件商品</text>
        <view class="cart-header-action" @click="onChangeEditMode(!state.editMode)">
          <text class="action-text">{{ state.editMode ? '取消' : '编辑' }}</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <scroll-view class="cart-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
        <CartItemCard
          v-for="item in state.list"
          :key="item.id"
          :item="item"
          :selected="state.selectedIds.includes(item.id)"
          :editMode="state.editMode"
          @select="onSelectSingle(item.id)"
          @increase="onIncrease(item)"
          @decrease="onDecrease(item)"
        />

        <!-- 加购推荐 -->
        <view class="upsell-section" v-if="upsellDishes.length">
          <text class="upsell-title">为你推荐</text>
          <scroll-view class="upsell-scroll" scroll-x :show-scrollbar="false">
            <view
              v-for="d in upsellDishes"
              :key="d.spuId"
              class="upsell-card"
              @click="goDishDetail(d)"
            >
              <su-image :src="d.coverUrl || '/static/logo.png'" :width="140" :height="140" borderRadius="12rpx" />
              <text class="upsell-card-name">{{ d.name }}</text>
              <view class="upsell-card-bottom">
                <text class="upsell-card-price">¥{{ d.minPrice || 0 }}</text>
                <view class="upsell-add-btn" @click.stop="quickAdd(d)">+</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="cart-footer">
        <view class="footer-left">
          <view class="check-circle" :class="{ checked: state.isAllSelected }" @click="onSelectAll">
            <text v-if="state.isAllSelected" class="check-mark">✓</text>
          </view>
          <text class="select-all-text">全选</text>
          <text class="footer-total-label">合计：</text>
          <text class="footer-total-price">¥{{ fen2yuan(state.totalPriceSelected) }}</text>
        </view>
        <view class="footer-right">
          <view v-if="state.editMode" class="delete-btn" @click="onDelete">删除</view>
          <view v-else class="confirm-btn" :class="{ disabled: !state.selectedIds.length }" @click="onConfirm">
            <text class="confirm-text">去结算{{ state.selectedIds.length ? `(${state.selectedIds.length})` : '' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import sheep from '@/sheep';
import { onShow } from '@dcloudio/uni-app';
import { computed, reactive, ref } from 'vue';
import { fen2yuan } from '@/sheep/hooks/useGoods';
import { isEmpty } from '@/sheep/helper/utils';
import SpuApi from '@/sheep/api/product/spu';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import EmptyState from '@/components/abao/EmptyState.vue';
import ErrorState from '@/components/abao/ErrorState.vue';
import LoadingSkeleton from '@/components/abao/LoadingSkeleton.vue';
import CartItemCard from './components/CartItemCard.vue';

const cart = sheep.$store('cart');
const menuStore = sheep.$store('menu');

const loading = ref(false);
const loadError = ref(false);
const scrollHeight = ref(400);

const state = reactive({
  editMode: computed(() => cart.editMode),
  list: computed(() => cart.list),
  selectedIds: computed(() => cart.selectedIds),
  isAllSelected: computed(() => cart.isAllSelected),
  totalPriceSelected: computed(() => cart.totalPriceSelected),
});

// 加购推荐（从缓存菜单中取）
const upsellDishes = computed(() => {
  const cats = menuStore.categories || [];
  const all = [];
  for (const cat of cats) {
    const dishes = cat.dishes || [];
    for (const d of dishes) {
      if (!d.isSoldOut) all.push(d);
    }
  }
  return all.slice(0, 6);
});

function calcScrollHeight() {
  const sysInfo = uni.getSystemInfoSync();
  const navH = 44 + (sysInfo.statusBarHeight || 44);
  const headerH = 80;
  const footerH = 100;
  scrollHeight.value = sysInfo.windowHeight - navH - headerH - footerH;
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

function goDishDetail(dish) {
  uni.navigateTo({ url: `/pages/dish/detail?spuId=${dish.spuId}` });
}

function quickAdd(dish) {
  const sku = (dish.skus && dish.skus.length === 1) ? dish.skus[0] : { id: 0, name: '', price: dish.minPrice || 0 };
  cart.addItem({
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
}

function onSelectSingle(id) {
  cart.selectSingle(id);
}

function onSelectAll() {
  cart.selectAll(!state.isAllSelected);
}

function onChangeEditMode(flag) {
  cart.onChangeEditMode(flag);
}

function onIncrease(item) {
  cart.update({
    goods_id: item.id,
    goods_num: item.count + 1,
    goods_sku_price_id: item.goods_sku_price_id,
  });
}

function onDecrease(item) {
  if (item.count <= 1) {
    cart.delete(item.id);
    return;
  }
  cart.update({
    goods_id: item.id,
    goods_num: item.count - 1,
    goods_sku_price_id: item.goods_sku_price_id,
  });
}

async function onDelete() {
  cart.delete(state.selectedIds);
}

async function onConfirm() {
  const selectedList = state.list.filter((item) => state.selectedIds.includes(item.id));
  const items = selectedList.map((item) => ({
    skuId: item.sku.id,
    count: item.count,
    cartId: item.id,
    categoryId: item.spu.categoryId,
  }));
  if (isEmpty(items)) {
    sheep.$helper.toast('请先选择商品');
    return;
  }
  try {
    await validateDeliveryType(selectedList.map((item) => item.spu.id));
    sheep.$router.go('/pages/order/confirm', { data: JSON.stringify({ items }) });
  } catch {
    // toast already shown in validateDeliveryType
  }
}

async function validateDeliveryType(spuIds) {
  const { data: spuList } = await SpuApi.getSpuListByIds(spuIds.join(','));
  if (isEmpty(spuList)) {
    sheep.$helper.toast('未找到商品信息');
    throw new Error('未找到商品信息');
  }
  const deliveryTypesList = spuList.map((item) => item.deliveryTypes);
  const hasConflict = checkDeliveryConflicts(deliveryTypesList);
  if (hasConflict) {
    sheep.$helper.toast('选中商品支持的配送方式冲突，不允许提交');
    throw new Error('选中商品支持的配送方式冲突，不允许提交');
  }
}

function checkDeliveryConflicts(deliveryTypesList) {
  for (let i = 0; i < deliveryTypesList.length - 1; i++) {
    for (let j = i + 1; j < deliveryTypesList.length; j++) {
      if (!deliveryTypesList[i].some((type) => deliveryTypesList[j].includes(type))) {
        return true;
      }
    }
  }
  return false;
}

async function getCartList() {
  loading.value = true;
  loadError.value = false;
  try {
    await cart.getList();
  } catch {
    loadError.value = true;
  }
  loading.value = false;
}

function retryLoad() {
  getCartList();
}

onShow(() => {
  // debug 截图支持：页面参数 ?debug=loading|error|empty
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const debug = page?.options?.debug;
  if (debug === 'loading') { loading.value = true; return; }
  if (debug === 'error') { loadError.value = true; return; }
  if (debug === 'empty') { loading.value = false; loadError.value = false; state.list = []; return; }

  calcScrollHeight();
  getCartList();
  // 预加载菜单数据用于加购推荐
  if (menuStore.isExpired) {
    menuStore.fetchMenu().catch(() => {});
  }
});
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* ── 空状态 ── */
.empty-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.empty-actions {
  margin-top: 32rpx;
}

.empty-btn {
  padding: 16rpx 48rpx;
  border-radius: var(--r-pill);
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  background: var(--abao-red);
  color: #fff;
  box-shadow: var(--shadow-red);
}

/* ── 错误 ── */
.error-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── 内容区 ── */
.cart-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 28rpx;
  background: var(--ink-100);
  flex-shrink: 0;
}

.cart-header-count {
  font-size: 26rpx;
  color: var(--ink-700);
}

.count-num {
  color: var(--abao-red);
  font-weight: 700;
}

.action-text {
  font-size: 26rpx;
  color: var(--abao-red);
}

.cart-scroll {
  flex: 1;
  padding: 0 28rpx;
}

/* ── 加购推荐 ── */
.upsell-section {
  margin-top: 32rpx;
  padding-bottom: 24rpx;
}

.upsell-title {
  font-family: var(--font-display);
  font-size: 30rpx;
  font-weight: 800;
  color: var(--ink-900);
  display: block;
  margin-bottom: 16rpx;
}

.upsell-scroll {
  white-space: nowrap;
}

.upsell-card {
  display: inline-flex;
  flex-direction: column;
  width: 200rpx;
  margin-right: 16rpx;
  vertical-align: top;
}

.upsell-card-name {
  font-size: 24rpx;
  color: var(--ink-700);
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upsell-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rpx;
}

.upsell-card-price {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.upsell-add-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--abao-red);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  box-shadow: var(--shadow-red);
}

/* ── 底部操作栏 ── */
.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 28rpx;
  background: var(--bg);
  border-top: 0.5px solid var(--ink-200);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-total-label {
  font-size: 28rpx;
  color: var(--ink-700);
  margin-left: 12rpx;
}

.footer-total-price {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.select-all-text {
  font-size: 26rpx;
  color: var(--ink-700);
}

.footer-right {
  display: flex;
  align-items: center;
}

.confirm-btn {
  padding: 18rpx 44rpx;
  background: var(--abao-red);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-red);

  &.disabled {
    background: var(--ink-300);
    box-shadow: none;
  }
}

.confirm-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.delete-btn {
  padding: 18rpx 44rpx;
  background: var(--abao-red);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-red);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

/* ── 复选圆圈 (footer用) ── */
.check-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid var(--ink-300);
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background: var(--abao-red);
    border-color: var(--abao-red);
  }
}

.check-mark {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}
</style>
