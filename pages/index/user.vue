<template>
  <view class="user-page">
    <AbaoNavBar title="我的" :dark="true" />

    <!-- 头部 -->
    <view class="user-header">
      <image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname || '阿堡顾客' }}</text>
        <text class="sub-text">欢迎光临阿堡</text>
      </view>
    </view>

    <!-- 订单入口 -->
    <AbaoCard class="section-card">
      <text class="section-title">我的订单</text>
      <view class="order-actions">
        <view class="action-item" @tap="goOrderList(0)">
          <text class="action-value">{{ state.orderCounts.pending || 0 }}</text>
          <text class="action-label">待支付</text>
        </view>
        <view class="action-item" @tap="goOrderList(1)">
          <text class="action-value">{{ state.orderCounts.progress || 0 }}</text>
          <text class="action-label">进行中</text>
        </view>
        <view class="action-item" @tap="goOrderList(4)">
          <text class="action-value">{{ state.orderCounts.done || 0 }}</text>
          <text class="action-label">已完成</text>
        </view>
      </view>
    </AbaoCard>

    <!-- 会员功能 -->
    <AbaoCard class="section-card">
      <text class="section-title">会员功能</text>
      <view class="menu-item" @tap="goPage('/pages/index/member')">
        <text class="menu-label">💎 会员专区</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/index/medals')">
        <text class="menu-label">🏅 勋章馆</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/index/lottery')">
        <text class="menu-label">🎰 堡米转盘</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/index/giftcard')">
        <text class="menu-label">🎁 礼品卡</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/index/student')">
        <text class="menu-label">🎓 学生卡</text>
        <text class="menu-arrow">›</text>
      </view>
    </AbaoCard>

    <!-- 门店信息 -->
    <AbaoCard class="section-card">
      <text class="section-title">当前门店</text>
      <view class="store-info" @tap="goPage('/pages/index/stores')">
        <text class="store-name">{{ storeStore.storeName || '未识别' }}</text>
        <text class="store-switch">切换门店 ›</text>
        <text class="table-text" v-if="tableStore.tableNo">桌号：{{ tableStore.tableNo }}</text>
      </view>
    </AbaoCard>

    <!-- 设置 -->
    <AbaoCard class="section-card">
      <view class="menu-item" @tap="onClearCache">
        <text class="menu-label">清除缓存</text>
        <text class="menu-arrow">›</text>
      </view>
    </AbaoCard>

    <AbaoTabBar />
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';
import AbaoTabBar from '@/components/abao/AbaoTabBar.vue';
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
  const appStore = sheep.$store('app');
  appStore.setParamsForTabbar({ type: status });
  uni.switchTab({ url: '/pages/order/list' });
}

function onClearCache() {
  uni.clearStorageSync();
  uni.showToast({ title: '缓存已清除', icon: 'none' });
}

function goPage(url) {
  uni.navigateTo({ url });
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
  background: var(--bg);
}

.user-header {
  background: linear-gradient(135deg, var(--abao-red), var(--abao-red-deep));
  padding: 60rpx 30rpx 40rpx;
  display: flex;
  align-items: center;
  margin-top: -44px;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  margin-right: 24rpx;
  background: #fff;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.sub-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-top: 8rpx;
}

.section-card {
  margin: 16rpx 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink-900);
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
  font-weight: 700;
  color: var(--abao-red);
  margin-bottom: 8rpx;
  font-family: var(--font-num);
}

.action-label {
  font-size: 24rpx;
  color: var(--ink-500);
}

.store-info {
  padding: 10rpx 0;
}

.store-name {
  font-size: 28rpx;
  color: var(--ink-900);
}

.store-switch {
  font-size: 22rpx;
  color: var(--abao-red);
  margin-left: 16rpx;
}

.table-text {
  font-size: 24rpx;
  color: var(--ink-500);
  display: block;
  margin-top: 8rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;

  & + .menu-item {
    border-top: 0.5px solid var(--ink-100);
  }
}

.menu-label {
  font-size: 28rpx;
  color: var(--ink-900);
}

.menu-arrow {
  font-size: 28rpx;
  color: var(--ink-300);
}
</style>
