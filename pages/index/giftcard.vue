<template>
  <view class="giftcard-page">
    <AbaoNavBar title="礼品卡" :dark="true" :showBack="true" />

    <scroll-view class="giftcard-scroll" scroll-y>
      <!-- Hero -->
      <view class="giftcard-hero">
        <text class="giftcard-hero-label">ABAO GIFT CARD</text>
        <text class="giftcard-hero-title">送 TA 一杯</text>
        <text class="giftcard-hero-title">堡式心意</text>
      </view>

      <!-- 卡片横向滑动 -->
      <scroll-view class="giftcard-cards" scroll-x :show-scrollbar="false">
        <view
          v-for="card in cards"
          :key="card.amount"
          class="giftcard-card"
          :style="{ background: `linear-gradient(135deg, ${card.c1} 0%, ${card.c2} 100%)` }"
        >
          <view class="giftcard-card-ring" />
          <text class="giftcard-card-brand">阿堡</text>
          <text class="giftcard-card-label">GIFT CARD</text>
          <view class="giftcard-card-bottom">
            <text class="giftcard-card-type">{{ card.type }}</text>
            <text class="giftcard-card-amount">¥{{ card.amount }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 功能区 -->
      <view class="giftcard-section">
        <AbaoCard class="giftcard-menu-item">
          <view class="giftcard-menu-row" @click="handleRedeem">
            <text class="giftcard-menu-text">🎫 兑换码兑换</text>
            <text class="giftcard-menu-link">立即兑换 ›</text>
          </view>
        </AbaoCard>

        <AbaoCard class="giftcard-menu-item">
          <view class="giftcard-menu-row">
            <text class="giftcard-menu-text">📦 我的礼品卡 (2)</text>
            <text class="giftcard-menu-arrow">›</text>
          </view>
        </AbaoCard>

        <AbaoCard class="giftcard-menu-item">
          <view class="giftcard-menu-row">
            <text class="giftcard-menu-text">📜 获赠记录</text>
            <text class="giftcard-menu-arrow">›</text>
          </view>
        </AbaoCard>

        <button class="giftcard-send-btn" @click="handleSend">
          赠送朋友一张 ›
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';

const cards = [
  { amount: '50', c1: '#9E2A1A', c2: '#6E1A0A', type: '经典款' },
  { amount: '100', c1: '#F5D98E', c2: '#C4903C', type: '满堡款' },
  { amount: '200', c1: '#4A3A35', c2: '#2A2218', type: '黑金款' },
  { amount: '500', c1: '#9DC8D8', c2: '#4A8A9A', type: '礼盒款' },
];

function handleRedeem() {
  uni.showToast({ title: '兑换码功能开发中', icon: 'none' });
}

function handleSend() {
  uni.showToast({ title: '赠送功能开发中', icon: 'none' });
}
</script>

<style lang="scss" scoped>
.giftcard-page {
  height: 100vh;
  background: var(--bg);
}

.giftcard-scroll {
  height: 100%;
}

/* Hero */
.giftcard-hero {
  padding: 80rpx 32rpx 160rpx;
  margin-top: -44px;
  background: linear-gradient(135deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
}

.giftcard-hero-label {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 6rpx;
  font-family: Helvetica, sans-serif;
}

.giftcard-hero-title {
  display: block;
  font-family: var(--font-display);
  font-size: 60rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 16rpx;
  line-height: 1.15;
}

/* 卡片滑动区 */
.giftcard-cards {
  margin-top: -120rpx;
  padding: 0 28rpx;
  white-space: nowrap;
}

.giftcard-card {
  display: inline-flex;
  flex-direction: column;
  width: 400rpx;
  aspect-ratio: 1.6;
  border-radius: var(--r-lg);
  padding: 28rpx;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-right: 20rpx;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.giftcard-card-ring {
  position: absolute;
  right: -60rpx;
  top: -60rpx;
  width: 240rpx;
  height: 240rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.giftcard-card-brand {
  font-family: var(--font-display);
  font-size: 28rpx;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.giftcard-card-label {
  font-size: 20rpx;
  opacity: 0.7;
  font-family: Helvetica, sans-serif;
  letter-spacing: 4rpx;
  margin-top: 4rpx;
  position: relative;
  z-index: 1;
}

.giftcard-card-bottom {
  position: absolute;
  bottom: 28rpx;
  left: 28rpx;
  z-index: 1;
}

.giftcard-card-type {
  display: block;
  font-size: 22rpx;
  opacity: 0.85;
}

.giftcard-card-amount {
  display: block;
  font-family: var(--font-num);
  font-size: 60rpx;
  font-weight: 800;
  line-height: 1;
  margin-top: 4rpx;
}

/* 功能区 */
.giftcard-section {
  padding: 36rpx 28rpx;
}

.giftcard-menu-item {
  margin-bottom: 20rpx;
  padding: 24rpx;
}

.giftcard-menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.giftcard-menu-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--ink-900);
}

.giftcard-menu-link {
  color: var(--abao-red);
  font-size: 22rpx;
}

.giftcard-menu-arrow {
  color: var(--ink-500);
  font-size: 22rpx;
}

.giftcard-send-btn {
  width: 100%;
  padding: 28rpx;
  background: var(--abao-red);
  color: #fff;
  border: none;
  border-radius: var(--r-pill);
  font-size: 28rpx;
  font-weight: 600;
  margin-top: 36rpx;
  box-shadow: var(--shadow-red);
}
</style>
