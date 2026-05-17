<template>
  <view class="order-list-page">
    <AbaoNavBar title="我的订单" />

    <!-- Tab 切换 -->
    <view class="tabs-bar">
      <view
        v-for="(tab, idx) in tabMaps"
        :key="idx"
        class="tabs-item"
        :class="{ active: state.currentTab === idx }"
        @click="onTabsChange({ index: idx })"
      >
        <text class="tabs-text">{{ tab.name }}</text>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="state.loading" style="padding: 0 28rpx;">
      <LoadingSkeleton variant="list" :count="3" />
    </view>

    <!-- 加载失败 -->
    <view v-if="loadError" class="error-view">
      <ErrorState errorType="network" retryText="重新加载" @retry="retryLoad" />
    </view>

    <!-- 空订单 -->
    <view v-if="!state.loading && !loadError && state.pagination.total === 0" class="empty-view">
      <EmptyState scenario="customer" icon="📋" title="暂无订单" description="快去点餐吧" />
    </view>

    <scroll-view class="order-scroll" scroll-y v-if="!state.loading && !loadError && state.pagination.total > 0" :style="{ height: scrollHeight + 'px' }">
      <view
        class="order-card"
        v-for="order in state.pagination.list"
        :key="order.id"
        @tap="onOrderDetail(order.id)"
      >
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :style="{ color: statusColor(order.status) }">{{ statusLabel(order.status) }}</text>
        </view>

        <view class="order-body">
          <view class="order-item-row">
            <text class="item-label">就餐人数</text>
            <text class="item-value">{{ order.dinerCount || 0 }}人</text>
          </view>
          <view class="order-item-row">
            <text class="item-label">下单时间</text>
            <text class="item-value">{{ formatTime(order.createTime) }}</text>
          </view>
        </view>

        <view class="order-footer">
          <text class="footer-label">合计：</text>
          <text class="footer-price">¥{{ (order.payAmount || 0).toFixed(2) }}</text>
        </view>

        <view class="order-actions" v-if="order.status === 0">
          <button class="action-btn cancel-btn" @tap.stop="onCancel(order.id)">取消订单</button>
          <button class="action-btn pay-btn" @tap.stop="onPay(order.id)">去支付</button>
        </view>
      </view>

      <uni-load-more
        :status="state.loadStatus"
        :content-text="{ contentdown: '上拉加载更多' }"
      />
    </scroll-view>

    <AbaoTabBar />
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoTabBar from '@/components/abao/AbaoTabBar.vue';
import LoadingSkeleton from '@/components/abao/LoadingSkeleton.vue';
import EmptyState from '@/components/abao/EmptyState.vue';
import ErrorState from '@/components/abao/ErrorState.vue';
import OrderApi from '@/sheep/api/restaurant/restaurant_order';
import { concat } from 'lodash-es';
import { resetPagination } from '@/sheep/helper/utils';

const scrollHeight = ref(0);
const loadError = ref(false);

const state = reactive({
  currentTab: 0,
  pagination: {
    list: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
  },
  loadStatus: '',
  loading: true,
});

const tabMaps = [
  { name: '全部' },
  { name: '待支付', value: 0 },
  { name: '进行中', value: 1 },
  { name: '已完成', value: 4 },
];

function statusLabel(status) {
  const map = { 0: '待支付', 1: '已支付', 2: '备餐中', 3: '已出餐', 4: '已完成', 5: '已取消' };
  return map[status] || '未知';
}

function statusColor(status) {
  const map = { 0: 'var(--abao-yellow)', 1: 'var(--abao-red)', 2: 'var(--abao-yellow)', 3: 'var(--accent-mint)', 4: 'var(--ink-300)', 5: 'var(--ink-300)' };
  return map[status] || 'var(--ink-300)';
}

function formatTime(time) {
  if (!time) return '-';
  return time.replace('T', ' ').substring(0, 19);
}

function onTabsChange(e) {
  if (state.currentTab === e.index) return;
  resetPagination(state.pagination);
  state.currentTab = e.index;
  getOrderList();
}

async function getOrderList() {
  state.loadStatus = 'loading';
  loadError.value = false;
  try {
    const { code, data } = await OrderApi.getOrderPage({
      pageNo: state.pagination.pageNo,
      pageSize: state.pagination.pageSize,
      status: tabMaps[state.currentTab].value,
    });
    if (code !== 0) {
      loadError.value = true;
      state.loading = false;
      return;
    }
    state.pagination.list = concat(state.pagination.list, data.list || []);
    state.pagination.total = data.total || 0;
    state.loadStatus = state.pagination.list.length < state.pagination.total ? 'more' : 'noMore';
  } catch {
    loadError.value = true;
  }
  state.loading = false;
}

function retryLoad() {
  resetPagination(state.pagination);
  getOrderList();
}

function onOrderDetail(id) {
  uni.navigateTo({ url: '/pages/order/detail?id=' + id });
}

function onPay(id) {
  uni.navigateTo({ url: '/pages/order/detail?id=' + id });
}

async function onCancel(orderId) {
  uni.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: async (res) => {
      if (!res.confirm) return;
      const { code } = await OrderApi.cancelOrder(orderId);
      if (code === 0) {
        resetPagination(state.pagination);
        await getOrderList();
      }
    },
  });
}

onLoad((options) => {
  // debug 截图支持：?debug=loading|error|empty
  if (options?.debug === 'loading') { state.loading = true; return; }
  if (options?.debug === 'error') { state.loading = false; loadError.value = true; return; }
  if (options?.debug === 'empty') { state.loading = false; loadError.value = false; state.pagination.total = 0; return; }

  const sysInfo = uni.getSystemInfoSync();
  const navH = 44 + (sysInfo.statusBarHeight || 44);
  scrollHeight.value = sysInfo.windowHeight - navH - 44 - 50;

  const appStore = sheep.$store('app');
  const tabParams = appStore.paramsForTabbar;
  if (tabParams && tabParams.type !== undefined) {
    state.currentTab = Number(tabParams.type);
    appStore.clearParamsForTabbar();
  } else if (options.type) {
    state.currentTab = Number(options.type);
  }
  getOrderList();
});

onShow(() => {
  // 从其他页面返回时刷新
  if (state.pagination.list.length > 0) {
    resetPagination(state.pagination);
    getOrderList();
  }
});

onReachBottom(() => {
  if (state.loadStatus === 'noMore') return;
  state.pagination.pageNo++;
  getOrderList();
});

onPullDownRefresh(() => {
  resetPagination(state.pagination);
  getOrderList();
  setTimeout(() => uni.stopPullDownRefresh(), 800);
});
</script>

<style lang="scss" scoped>
.order-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
}

/* ── Tabs ── */
.tabs-bar {
  display: flex;
  background: var(--bg);
  border-bottom: 0.5px solid var(--ink-200);
  flex-shrink: 0;
}

.tabs-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  position: relative;

  &.active {
    .tabs-text {
      color: var(--abao-red);
      font-weight: 700;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background: var(--abao-red);
      border-radius: 2rpx;
    }
  }
}

.tabs-text {
  font-size: 28rpx;
  color: var(--ink-500);
}

.empty-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-scroll {
  padding: 0 20rpx;
}

.order-card {
  background: var(--bg);
  padding: 24rpx;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  margin: 16rpx 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 0.5px solid var(--ink-100);
}

.order-no {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink-900);
}

.order-status {
  font-size: 26rpx;
  font-weight: 600;
}

.order-body {
  padding: 16rpx 0;
}

.order-item-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.item-label {
  font-size: 26rpx;
  color: var(--ink-500);
}

.item-value {
  font-size: 26rpx;
  color: var(--ink-900);
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  padding: 16rpx 0;
  border-top: 0.5px solid var(--ink-100);
}

.footer-label {
  font-size: 26rpx;
  color: var(--ink-500);
}

.footer-price {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding-top: 12rpx;
}

.action-btn {
  width: 160rpx;
  height: 56rpx;
  border-radius: var(--r-pill);
  font-size: 24rpx;
  line-height: 56rpx;
  border: none;
  padding: 0;
  font-weight: 600;
}

.cancel-btn {
  background: var(--ink-100);
  color: var(--ink-700);
}

.pay-btn {
  background: var(--abao-red);
  color: #fff;
  box-shadow: var(--shadow-red);
}
</style>
