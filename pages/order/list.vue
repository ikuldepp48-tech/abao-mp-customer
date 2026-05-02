<template>
  <s-layout title="我的订单">
    <su-sticky bgColor="#fff">
      <su-tabs
        :list="tabMaps"
        :scrollable="false"
        @change="onTabsChange"
        :current="state.currentTab"
      />
    </su-sticky>

    <s-empty v-if="!state.loading && state.pagination.total === 0" text="暂无订单" />

    <view v-if="state.pagination.total > 0">
      <view
        class="order-card ss-m-20 ss-r-12 bg-white"
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
    </view>

    <uni-load-more
      v-if="state.pagination.total > 0"
      :status="state.loadStatus"
      :content-text="{ contentdown: '上拉加载更多' }"
    />
  </s-layout>
</template>

<script setup>
import { reactive } from 'vue';
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import OrderApi from '@/sheep/api/restaurant/restaurant_order';
import { concat } from 'lodash-es';
import { resetPagination } from '@/sheep/helper/utils';

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
  const map = { 0: '#FAAD14', 1: '#D4351C', 2: '#FAAD14', 3: '#52C41A', 4: '#999', 5: '#999' };
  return map[status] || '#999';
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
  const { code, data } = await OrderApi.getOrderPage({
    pageNo: state.pagination.pageNo,
    pageSize: state.pagination.pageSize,
    status: tabMaps[state.currentTab].value,
  });
  state.loading = false;
  if (code !== 0) return;

  state.pagination.list = concat(state.pagination.list, data.list || []);
  state.pagination.total = data.total || 0;
  state.loadStatus = state.pagination.list.length < state.pagination.total ? 'more' : 'noMore';
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
.order-card {
  padding: 24rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-no {
  font-size: 26rpx;
  font-weight: 500;
  color: $dark-3;
}

.order-status {
  font-size: 26rpx;
  font-weight: 500;
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
  color: $dark-9;
}

.item-value {
  font-size: 26rpx;
  color: $dark-3;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  padding: 16rpx 0;
  border-top: 1rpx solid #f5f5f5;
}

.footer-label {
  font-size: 26rpx;
  color: $dark-9;
}

.footer-price {
  font-size: 30rpx;
  font-weight: bold;
  color: $red;
  font-family: OPPOSANS;
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
  border-radius: 28rpx;
  font-size: 24rpx;
  line-height: 56rpx;
  border: none;
  padding: 0;
}

.cancel-btn {
  background: #eee;
  color: $dark-6;
}

.pay-btn {
  background: $red;
  color: #fff;
}
</style>
