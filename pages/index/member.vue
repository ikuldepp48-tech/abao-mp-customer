<template>
  <view class="member-page">
    <!-- Hero 头部 -->
    <view class="member-hero">
      <view class="member-hero-bg" />
      <AbaoLogo size="lg" />
      <text class="member-hero-title">会员专区</text>
      <text class="member-hero-sub">堡米积分 · 专属权益 · 更多惊喜</text>
      <view class="member-hero-stats">
        <view class="stat-item">
          <text class="stat-value">120</text>
          <text class="stat-label">堡米</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">Lv.2</text>
          <text class="stat-label">等级</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">3</text>
          <text class="stat-label">勋章</text>
        </view>
      </view>
    </view>

    <!-- 功能入口网格 -->
    <view class="member-grid">
      <view class="member-card" @click="goPage('/pages/index/medals')">
        <view class="member-card-icon medals-icon">🏅</view>
        <text class="member-card-title">勋章馆</text>
        <text class="member-card-desc">收集堡道勋章</text>
        <text class="member-card-link">查看 ›</text>
      </view>

      <view class="member-card" @click="goPage('/pages/index/lottery')">
        <view class="member-card-icon lottery-icon">🎰</view>
        <text class="member-card-title">堡米转盘</text>
        <text class="member-card-desc">100% 中奖</text>
        <text class="member-card-link">抽奖 ›</text>
      </view>

      <view class="member-card" @click="goPage('/pages/index/giftcard')">
        <view class="member-card-icon gift-icon">🎁</view>
        <text class="member-card-title">礼品卡</text>
        <text class="member-card-desc">送TA堡式心意</text>
        <text class="member-card-link">查看 ›</text>
      </view>

      <view class="member-card" @click="goPage('/pages/index/student')">
        <view class="member-card-icon student-icon">🎓</view>
        <text class="member-card-title">学生卡</text>
        <text class="member-card-desc">专属校园权益</text>
        <text class="member-card-link">开卡 ›</text>
      </view>

      <view class="member-card" @click="goPage('/pages/index/stores')">
        <view class="member-card-icon stores-icon">📍</view>
        <text class="member-card-title">选择门店</text>
        <text class="member-card-desc">查看附近门店</text>
        <text class="member-card-link">查看 ›</text>
      </view>

      <view class="member-card member-card--soon">
        <view class="member-card-icon soon-icon">✨</view>
        <text class="member-card-title">更多权益</text>
        <text class="member-card-desc">敬请期待</text>
        <text class="member-card-link soon">即将上线</text>
      </view>
    </view>

    <AbaoTabBar />
  </view>
</template>

<script setup>
import AbaoLogo from '@/components/abao/AbaoLogo.vue';
import AbaoTabBar from '@/components/abao/AbaoTabBar.vue';

function goPage(url) {
  uni.navigateTo({ url });
}
</script>

<style lang="scss" scoped>
.member-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 120rpx;
}

/* Hero */
.member-hero {
  position: relative;
  padding: 80rpx 32rpx 48rpx;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
}

.member-hero-title {
  display: block;
  font-family: var(--font-display);
  font-size: 44rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 24rpx;
}

.member-hero-sub {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 12rpx;
}

.member-hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 36rpx;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-family: var(--font-num);
  font-size: 40rpx;
  font-weight: 800;
  color: var(--abao-yellow);
}

.stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4rpx;
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.2);
}

/* 功能入口网格 */
.member-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 24rpx;
  margin-top: -20rpx;
}

.member-card {
  background: #fff;
  border-radius: var(--r-lg);
  padding: 32rpx 24rpx;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;

  &--soon {
    opacity: 0.6;
  }
}

.member-card-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-bottom: 16rpx;

  &.medals-icon { background: linear-gradient(135deg, #F5D98E, #B8441A); }
  &.lottery-icon { background: linear-gradient(135deg, #9E2A1A, #6E1A0A); }
  &.gift-icon { background: linear-gradient(135deg, #9DC8D8, #4A8A9A); }
  &.student-icon { background: linear-gradient(135deg, #F5EAE5, #E8C8B8); }
  &.stores-icon { background: linear-gradient(135deg, #A8D8C8, #5A9A7A); }
  &.soon-icon { background: var(--ink-100); }
}

.member-card-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--ink-900);
}

.member-card-desc {
  display: block;
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 6rpx;
}

.member-card-link {
  position: absolute;
  bottom: 20rpx;
  right: 24rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--abao-red);

  &.soon {
    color: var(--ink-400);
  }
}
</style>
