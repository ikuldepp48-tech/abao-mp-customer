<template>
  <view class="home-floating-cards">
    <view class="home-floating-inner">
      <!-- 到店自取 — 红软底 -->
      <view class="home-floating-card home-floating-card--dinein" @click="$emit('click-dinein')">
        <text class="home-floating-card-emoji">🍔</text>
        <text class="home-floating-card-title">到店自取</text>
        <text class="home-floating-card-desc">下单即做 · 现烤现夹</text>
      </view>

      <!-- 外卖到家 — 黄软底 -->
      <view class="home-floating-card home-floating-card--delivery" @click="$emit('click-delivery')">
        <text class="home-floating-card-emoji">🛵</text>
        <text class="home-floating-card-title">外卖到家</text>
        <text class="home-floating-card-desc">30分钟急送 · 暖盒派送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineEmits(['click-dinein', 'click-delivery'])
</script>

<style lang="scss" scoped>
.home-floating-cards {
  padding: 0 28rpx;
  margin-top: -112rpx;
  position: relative;
  z-index: 2;
}
.home-floating-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  background: #fff;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 28rpx;
}
.home-floating-card {
  border-radius: var(--r-md);
  padding: 32rpx 28rpx;
  position: relative;
  overflow: hidden;
}
.home-floating-card--dinein {
  background: var(--abao-red-soft);
}
.home-floating-card--delivery {
  background: var(--abao-yellow-soft);
}
.home-floating-card-emoji {
  position: absolute;
  right: -16rpx;
  top: -16rpx;
  font-size: 96rpx;
  opacity: 0.18;
}
.home-floating-card-title {
  display: block;
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
}
.home-floating-card-desc {
  display: block;
  font-size: 22rpx;
  color: var(--ink-700);
  margin-top: 4rpx;
}
</style>
