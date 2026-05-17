<template>
  <view v-if="dishes && dishes.length" class="home-recommend">
    <!-- 标题行 -->
    <view class="home-recommend-header">
      <view>
        <text class="home-recommend-title">今日招牌</text>
        <text class="home-recommend-sub">TODAY · CHEF'S PICK</text>
      </view>
      <text class="home-recommend-more" @click="$emit('click-more')">更多 ›</text>
    </view>

    <!-- 横向滑动卡片 -->
    <scroll-view class="home-recommend-scroll" scroll-x :show-scrollbar="false">
      <view
        v-for="(d, i) in dishes"
        :key="i"
        class="home-recommend-card"
        @click="$emit('click-dish', d)"
      >
        <!-- 菜品图片区（彩色背景 + 标签 + emoji） -->
        <view class="home-recommend-card-img" :style="{ background: d.bgColor || 'var(--ink-100)' }">
          <text class="home-recommend-card-tag">{{ d.tag }}</text>
          <text class="home-recommend-card-emoji">{{ d.emoji || '🍔' }}</text>
        </view>

        <!-- 信息区 -->
        <view class="home-recommend-card-body">
          <text class="home-recommend-card-name">{{ d.name }}</text>
          <view class="home-recommend-card-bottom">
            <view class="home-recommend-card-price">
              <text class="home-recommend-card-price-symbol">¥</text>
              <text class="home-recommend-card-price-num">{{ d.price }}</text>
            </view>
            <view class="home-recommend-card-add" @click.stop="$emit('quick-add', d)">
              <text>+</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
defineProps({
  dishes: { type: Array, default: () => [] },
})

defineEmits(['click-dish', 'quick-add', 'click-more'])
</script>

<style lang="scss" scoped>
.home-recommend-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 44rpx 28rpx 12rpx;
}
.home-recommend-title {
  display: block;
  font-family: var(--font-display);
  font-size: 40rpx;
  font-weight: 800;
  color: var(--ink-900);
}
.home-recommend-sub {
  display: block;
  font-size: 22rpx;
  color: var(--ink-500);
  font-family: var(--font-mono);
  letter-spacing: 1px;
}
.home-recommend-more {
  font-size: 22rpx;
  color: var(--abao-red);
}
.home-recommend-scroll {
  padding: 12rpx 28rpx 28rpx;
  white-space: nowrap;
}
.home-recommend-card {
  display: inline-block;
  width: 316rpx;
  background: #fff;
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--ink-100);
  margin-right: 20rpx;
  vertical-align: top;
}
.home-recommend-card-img {
  height: 240rpx;
  position: relative;
}
.home-recommend-card-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: #fff;
  padding: 6rpx 16rpx;
  border-radius: 999px;
  font-size: 18rpx;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--abao-red);
}
.home-recommend-card-emoji {
  position: absolute;
  bottom: 12rpx;
  right: 16rpx;
  font-size: 84rpx;
  opacity: 0.95;
}
.home-recommend-card-body {
  padding: 20rpx 24rpx;
}
.home-recommend-card-name {
  font-weight: 700;
  font-size: 26rpx;
  color: var(--ink-900);
}
.home-recommend-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}
.home-recommend-card-price-symbol {
  font-size: 20rpx;
  color: var(--abao-red);
}
.home-recommend-card-price-num {
  font-family: var(--font-num);
  font-size: 36rpx;
  font-weight: 700;
  color: var(--abao-red);
}
.home-recommend-card-add {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: var(--abao-red);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  box-shadow: var(--shadow-red);
}
</style>
