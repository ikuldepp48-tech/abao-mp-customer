<template>
  <view class="medals-page">
    <AbaoNavBar title="勋章馆" :dark="true" :showBack="true" />

    <scroll-view class="medals-scroll" scroll-y>
      <!-- Hero 勋章展示 -->
      <view class="medals-hero">
        <text class="medals-rank">RANKING #2,148</text>
        <text class="medals-subtitle">堡道历程 · 见证你的每一杯</text>

        <!-- 主勋章 -->
        <view class="medals-badge-main">
          <view class="medals-badge-glow" />
          <view class="medals-badge-inner">
            <text class="medals-badge-char">堡</text>
            <text class="medals-badge-lv">LV.2</text>
          </view>
          <!-- 闪光点 -->
          <text class="medals-sparkle" style="top: 10px; left: 20px;">✦</text>
          <text class="medals-sparkle" style="top: 30px; right: 10px;">✦</text>
          <text class="medals-sparkle" style="bottom: 20px; left: 10px;">✦</text>
          <text class="medals-sparkle" style="bottom: 10px; right: 30px;">✦</text>
        </view>

        <text class="medals-hero-title">初登堡道 · Lv.2</text>
        <text class="medals-hero-desc">获得条件：累计消费满 10 杯</text>
        <text class="medals-hero-date">获得时间 2026-04-18</text>

        <view class="medals-hero-actions">
          <button class="medals-btn medals-btn--ghost">佩戴勋章</button>
          <button class="medals-btn medals-btn--red">炫耀一下</button>
        </view>
      </view>

      <!-- Tab -->
      <view class="medals-tabs">
        <text class="medals-tab medals-tab--active">已点亮 (3)</text>
        <text class="medals-tab">未获得</text>
        <text class="medals-tab">限定</text>
      </view>

      <!-- 勋章网格 -->
      <view class="medals-grid">
        <view v-for="(m, i) in medals" :key="i" class="medals-item">
          <view class="medals-item-icon" :class="{ unlocked: m.unlocked }" :style="m.unlocked ? { background: m.bg } : {}">
            <text>{{ m.unlocked ? '堡' : '?' }}</text>
          </view>
          <text class="medals-item-name" :class="{ dim: !m.unlocked }">{{ m.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';

const medals = [
  { name: '初登堡道', unlocked: true, bg: 'radial-gradient(circle at 35% 35%, #F5D98E, #B8441A)' },
  { name: '周三常客', unlocked: true, bg: 'radial-gradient(circle at 35% 35%, #E8A87C, #7A2E1A)' },
  { name: '尝鲜大师', unlocked: true, bg: 'radial-gradient(circle at 35% 35%, #A8D8D8, #2E5A6A)' },
  { name: '晨光独享', unlocked: false, bg: '' },
  { name: '双杯一人', unlocked: false, bg: '' },
  { name: '百日有堡', unlocked: false, bg: '' },
  { name: '分享达人', unlocked: false, bg: '' },
  { name: '满堡之友', unlocked: false, bg: '' },
  { name: '堡米百万', unlocked: false, bg: '' },
];
</script>

<style lang="scss" scoped>
.medals-page {
  height: 100vh;
  background: #1a1a1a;
}

.medals-scroll {
  flex: 1;
  height: 100%;
}

/* Hero */
.medals-hero {
  padding: 40rpx 32rpx 64rpx;
  text-align: center;
  background: radial-gradient(circle at 50% 30%, rgba(140, 60, 30, 0.3), transparent 50%),
              linear-gradient(180deg, #1a1a1a 0%, #0f0807 100%);
}

.medals-rank {
  font-size: 22rpx;
  color: var(--abao-yellow);
  letter-spacing: 6rpx;
  font-family: Helvetica, sans-serif;
}

.medals-subtitle {
  display: block;
  font-family: var(--font-display);
  font-size: 28rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 8rpx;
}

/* 主勋章 */
.medals-badge-main {
  margin: 44rpx auto 0;
  width: 360rpx;
  height: 360rpx;
  position: relative;
}

.medals-badge-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, var(--abao-yellow), rgba(210, 158, 28, 0.4), transparent);
  opacity: 0.6;
}

.medals-badge-inner {
  position: absolute;
  inset: 36rpx;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #FDF3C7, #D19E1C);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 8rpx #fff inset, 0 20rpx 80rpx rgba(0, 0, 0, 0.4);
}

.medals-badge-char {
  font-family: var(--font-display);
  font-size: 84rpx;
  font-weight: 900;
  color: var(--abao-red-deep);
  line-height: 1;
}

.medals-badge-lv {
  font-size: 18rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
  letter-spacing: 4rpx;
  margin-top: 8rpx;
}

.medals-sparkle {
  position: absolute;
  font-size: 28rpx;
  color: var(--abao-yellow);
}

/* Hero info */
.medals-hero-title {
  display: block;
  font-family: var(--font-display);
  font-size: 44rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 36rpx;
}

.medals-hero-desc {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 12rpx;
}

.medals-hero-date {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8rpx;
  font-family: Helvetica, sans-serif;
}

.medals-hero-actions {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  margin-top: 36rpx;
}

.medals-btn {
  padding: 20rpx 48rpx;
  border-radius: var(--r-pill);
  font-size: 26rpx;
  font-weight: 600;
  border: none;

  &--ghost {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  &--red {
    background: var(--abao-red);
    color: #fff;
  }
}

/* Tabs */
.medals-tabs {
  padding: 28rpx 28rpx 12rpx;
  display: flex;
  gap: 28rpx;
}

.medals-tab {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 12rpx;

  &--active {
    font-weight: 700;
    color: #fff;
    border-bottom: 4rpx solid var(--abao-yellow);
  }
}

/* Grid */
.medals-grid {
  padding: 20rpx 28rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.medals-item {
  text-align: center;
  padding: 20rpx 8rpx;
}

.medals-item-icon {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 48rpx;
  font-weight: 800;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.15);

  &.unlocked {
    border: 4rpx solid rgba(255, 255, 255, 0.2);
  }
}

.medals-item-name {
  display: block;
  font-size: 22rpx;
  margin-top: 12rpx;
  color: #fff;

  &.dim {
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
