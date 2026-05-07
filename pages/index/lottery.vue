<template>
  <view class="lottery-page">
    <AbaoNavBar :dark="true" :showBack="true">
      <template #right>
        <text class="lottery-rules">规则 ›</text>
      </template>
    </AbaoNavBar>

    <scroll-view class="lottery-scroll" scroll-y>
      <!-- 标题 -->
      <text class="lottery-label">ABAO LUCKY DRAW</text>
      <text class="lottery-title">堡米转盘 · 5月狂欢</text>
      <text class="lottery-sub">5 堡米抽 1 次 · 100% 中奖</text>

      <!-- 转盘 -->
      <view class="lottery-wheel-container">
        <view class="lottery-wheel" :style="{ transform: 'rotate(' + angle + 'deg)' }">
          <view
            v-for="(item, i) in items"
            :key="i"
            class="lottery-slice"
            :style="sliceStyle(i)"
          >
            <text class="lottery-slice-text" :class="{ 'text-light': i % 2 === 0 }">{{ item }}</text>
          </view>
        </view>
        <!-- 指针 -->
        <view class="lottery-pointer">
          <view class="lottery-pointer-arrow" />
        </view>
      </view>

      <!-- 堡米余额 -->
      <text class="lottery-balance">当前可用 <text class="lottery-balance-num">120</text> 堡米</text>

      <!-- 抽奖按钮 -->
      <button class="lottery-btn" :disabled="spinning" @click="spin">
        {{ spinning ? '抽奖中...' : '开始抽奖' }}
      </button>

      <!-- 近期中奖 -->
      <view class="lottery-recent">
        <view class="lottery-recent-header">
          <text class="lottery-recent-title">近期中奖</text>
          <text class="lottery-recent-more">我的记录 ›</text>
        </view>
        <text
          v-for="(r, i) in recentWinners"
          :key="i"
          class="lottery-recent-item"
        >{{ r }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';

const spinning = ref(false);
const angle = ref(0);

const items = ['¥4 减', '10元券', '5元券', '2积分', '免单券', '再来一次', '¥2 券', '5积分'];
const colors = ['var(--abao-red)', 'var(--abao-yellow)', 'var(--abao-red-soft)', 'var(--abao-yellow-soft)'];
const sliceAngle = 360 / items.length;

const recentWinners = [
  '198****1794 抽中 ¥4 减运券',
  '135****0822 抽中 免单券',
  '186****6612 抽中 5元券',
];

function sliceStyle(i) {
  return {
    transform: `rotate(${i * sliceAngle}deg)`,
    borderColor: `${colors[i % colors.length]} transparent transparent transparent`,
  };
}

function spin() {
  if (spinning.value) return;
  spinning.value = true;
  const extraRounds = 360 * 5;
  const randomDeg = Math.floor(Math.random() * 360);
  angle.value = angle.value + extraRounds + randomDeg;
  setTimeout(() => {
    spinning.value = false;
  }, 4100);
}
</script>

<style lang="scss" scoped>
.lottery-page {
  height: 100vh;
  background: linear-gradient(180deg, #9E2A1A 0%, #6E1A0A 100%);
  position: relative;
}

.lottery-scroll {
  height: 100%;
  padding: 20rpx 32rpx 48rpx;
  text-align: center;
}

.lottery-rules {
  font-size: 22rpx;
  color: #fff;
  opacity: 0.85;
}

/* 标题 */
.lottery-label {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 6rpx;
  font-family: Helvetica, sans-serif;
}

.lottery-title {
  display: block;
  font-family: var(--font-display);
  font-size: 60rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 16rpx;
  line-height: 1.2;
}

.lottery-sub {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 16rpx;
}

/* 转盘容器 */
.lottery-wheel-container {
  width: 560rpx;
  height: 560rpx;
  margin: 60rpx auto 28rpx;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #f0f0f0 100%);
  box-shadow: 0 0 0 16rpx #D19E1C, 0 0 0 24rpx var(--abao-red), 0 40rpx 100rpx rgba(0,0,0,0.3);
}

.lottery-wheel {
  position: absolute;
  inset: 8rpx;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 4s cubic-bezier(.17,.67,.3,1);
}

/* 扇形切片 */
.lottery-slice {
  position: absolute;
  left: 50%;
  top: 0;
  width: 0;
  height: 0;
  border-left: 154rpx solid transparent;
  border-right: 154rpx solid transparent;
  border-bottom: 280rpx solid;
  transform-origin: 50% 100%;
  margin-left: -154rpx;
  transform: rotate(0deg);
}

.lottery-slice-text {
  position: absolute;
  top: 48rpx;
  left: 50%;
  transform: translateX(-50%) rotate(22.5deg);
  font-size: 24rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
  width: 160rpx;
  text-align: center;
  white-space: nowrap;
  z-index: 1;

  &.text-light {
    color: #fff;
  }
}

/* 指针 */
.lottery-pointer {
  position: absolute;
  left: 50%;
  top: -16rpx;
  transform: translateX(-50%);
  z-index: 10;
}

.lottery-pointer-arrow {
  width: 0;
  height: 0;
  border-left: 28rpx solid transparent;
  border-right: 28rpx solid transparent;
  border-top: 44rpx solid var(--abao-red-deep);
}

/* 余额 */
.lottery-balance {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
}

.lottery-balance-num {
  font-family: var(--font-num);
  font-size: 28rpx;
  font-weight: 700;
}

/* 按钮 */
.lottery-btn {
  margin-top: 24rpx;
  padding: 28rpx 120rpx;
  background: var(--abao-yellow);
  color: var(--abao-red-deep);
  border: none;
  border-radius: var(--r-pill);
  font-size: 36rpx;
  font-weight: 800;
  font-family: var(--font-display);
  box-shadow: 0 16rpx 48rpx rgba(255, 200, 0, 0.4);

  &[disabled] {
    opacity: 0.6;
  }
}

/* 近期中奖 */
.lottery-recent {
  margin-top: 48rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--r-lg);
  text-align: left;
}

.lottery-recent-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.lottery-recent-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}

.lottery-recent-more {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
}

.lottery-recent-item {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
  padding: 10rpx 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}
</style>
