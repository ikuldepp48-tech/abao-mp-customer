<template>
  <view class="home-hero">
    <!-- 品牌行: Logo + EST.2026 -->
    <view class="home-hero-brand">
      <AbaoLogo size="md" color="#fff" />
      <text class="home-hero-est">ABAO BURGER · EST.2026</text>
    </view>

    <!-- 品牌口号 -->
    <text class="home-hero-slogan">
      一口阿堡<text class="home-hero-slogan--yellow">满嘴满足</text>
    </text>

    <!-- 英文副标题 -->
    <text class="home-hero-sub">HANDCRAFTED BURGERS · DAILY FRESH</text>

    <!-- 门店位置 chip -->
    <view class="home-hero-store" @click="$emit('click-store')">
      <text>📍</text>
      <text>{{ storeName || '选择门店' }}</text>
      <text v-if="storeDistance">· {{ storeDistance }}m</text>
    </view>
  </view>
</template>

<script setup>
import AbaoLogo from '@/components/abao/AbaoLogo.vue'

defineProps({
  storeName: { type: String, default: '' },
  storeDistance: { type: Number, default: null },
})

defineEmits(['click-store'])
</script>

<style lang="scss" scoped>
.home-hero {
  padding: 120rpx 36rpx 168rpx;
  margin-top: -88rpx;
  background: linear-gradient(180deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
  position: relative;
}
.home-hero-brand {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 36rpx;
}
.home-hero-est {
  font-family: var(--font-mono);
  font-size: 26rpx;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.85);
}
.home-hero-slogan {
  display: block;
  font-family: var(--font-display);
  font-size: 76rpx;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1px;
  color: #fff;
}
.home-hero-slogan--yellow {
  color: var(--abao-yellow);
}
.home-hero-sub {
  display: block;
  margin-top: 16rpx;
  font-family: var(--font-mono);
  font-size: 26rpx;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.85);
}
.home-hero-store {
  margin-top: 36rpx;
  display: inline-flex;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}
</style>
