<template>
  <s-layout title="我的" navbar="custom">
    <view class="user-page">
      <!-- 头部 -->
      <view class="user-header">
        <image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" />
        <view class="user-info">
          <text class="nickname">{{ userInfo.nickname || '阿堡顾客' }}</text>
          <text class="sub-text">欢迎光临阿堡</text>
        </view>
      </view>

      <!-- 订单入口 -->
      <view class="section-card ss-m-20">
        <text class="section-title">我的订单</text>
        <view class="order-actions">
          <view class="action-item">
            <text class="action-value" @tap="goOrderList(0)">{{ state.orderCounts.pending || 0 }}</text>
            <text class="action-label" @tap="goOrderList(0)">待支付</text>
          </view>
          <view class="action-item">
            <text class="action-value" @tap="goOrderList(1)">{{ state.orderCounts.progress || 0 }}</text>
            <text class="action-label" @tap="goOrderList(1)">进行中</text>
          </view>
          <view class="action-item">
            <text class="action-value" @tap="goOrderList(4)">{{ state.orderCounts.done || 0 }}</text>
            <text class="action-label" @tap="goOrderList(4)">已完成</text>
          </view>
        </view>
      </view>

      <!-- 门店信息 -->
      <view class="section-card ss-m-20">
        <text class="section-title">当前门店</text>
        <view class="store-info">
          <text class="store-name">{{ storeStore.storeName || '未识别' }}</text>
          <text class="table-text" v-if="tableStore.tableNo">桌号：{{ tableStore.tableNo }}</text>
        </view>
      </view>

      <!-- 设置 -->
      <view class="section-card ss-m-20">
        <view class="menu-item" @tap="onClearCache">
          <text class="menu-label">清除缓存</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
  </s-layout>
</template>

<script setup>
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import OrderApi from '@/sheep/api/restaurant/restaurant_order';

const storeStore = sheep.$store('store');
const tableStore = sheep.$store('table');

const userInfo = reactive({
  nickname: '',
  avatar: '',
});

const state = reactive({
  orderCounts: { pending: 0, progress: 0, done: 0 },
});

function goOrderList(status) {
  // tabBar 页面无法通过 URL 传参，使用 app store 中转
  const appStore = sheep.$store('app');
  appStore.setParamsForTabbar({ type: status });
  uni.switchTab({ url: '/pages/order/list' });
}

function onClearCache() {
  uni.clearStorageSync();
  uni.showToast({ title: '缓存已清除', icon: 'none' });
}

async function fetchOrderCount() {
  try {
    const { code, data } = await OrderApi.getOrderCount();
    if (code === 0 && data) {
      state.orderCounts = data;
    }
  } catch (e) {
    // 未登录时不请求
  }
}

onShow(async () => {
  try {
    const userStore = sheep.$store('user');
    if (userStore && userStore.userInfo) {
      userInfo.nickname = userStore.userInfo.nickname || '';
      userInfo.avatar = userStore.userInfo.avatar || '';
    }
    if (userStore && userStore.isLogin) {
      await fetchOrderCount();
    }
  } catch (e) {
    // user store may not be loaded
  }
});
</script>

<style lang="scss" scoped>
.user-page {
  min-height: 100vh;
  background: #f6f6f6;
}

.user-header {
  background: linear-gradient(135deg, $red, #E85D3A);
  padding: 80rpx 30rpx 40rpx;
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: 24rpx;
  background: #fff;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.sub-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-top: 8rpx;
}

.section-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: $dark-3;
  display: block;
  margin-bottom: 20rpx;
}

.order-actions {
  display: flex;
  justify-content: space-around;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-value {
  font-size: 36rpx;
  font-weight: bold;
  color: $red;
  margin-bottom: 8rpx;
}

.action-label {
  font-size: 24rpx;
  color: $dark-9;
}

.store-info {
  padding: 10rpx 0;
}

.store-name {
  font-size: 28rpx;
  color: $dark-3;
}

.table-text {
  font-size: 24rpx;
  color: $dark-9;
  display: block;
  margin-top: 8rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.menu-label {
  font-size: 28rpx;
  color: $dark-3;
}

.menu-arrow {
  font-size: 28rpx;
  color: $dark-a;
}
</style>
