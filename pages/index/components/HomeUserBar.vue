<template>
  <view class="home-user-bar">
    <!-- 已登录 -->
    <template v-if="isLoggedIn">
      <view class="home-user-bar-left">
        <view class="home-user-bar-avatar">
          <image v-if="avatar" :src="avatar" class="home-user-bar-avatar-img" />
          <view v-else class="home-user-bar-avatar-placeholder" />
        </view>
        <view class="home-user-bar-info">
          <text class="home-user-bar-name">{{ nickname }}</text>
          <text class="home-user-bar-level">Lv.{{ level }} · 堡米 {{ points }}</text>
        </view>
      </view>
      <view class="home-user-bar-right">
        <view class="home-user-bar-stat">
          <text class="home-user-bar-stat-num">{{ couponCount }}</text>
          <text class="home-user-bar-stat-label">优惠券</text>
        </view>
        <view class="home-user-bar-stat">
          <text class="home-user-bar-stat-num">{{ medalCount }}</text>
          <text class="home-user-bar-stat-label">勋章</text>
        </view>
      </view>
    </template>

    <!-- 未登录 -->
    <view v-else class="home-user-bar-login" @click="$emit('click-login')">
      <text class="home-user-bar-login-text">登录领新人福利</text>
      <text class="home-user-bar-login-arrow">›</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  isLoggedIn: { type: Boolean, default: false },
  nickname: { type: String, default: '' },
  avatar: { type: String, default: '' },
  level: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  couponCount: { type: Number, default: 0 },
  medalCount: { type: Number, default: 0 },
})

defineEmits(['click-login'])
</script>

<style lang="scss" scoped>
.home-user-bar {
  padding: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home-user-bar-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.home-user-bar-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.home-user-bar-avatar-img {
  width: 100%;
  height: 100%;
}
.home-user-bar-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--ink-200);
}
.home-user-bar-name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink-900);
}
.home-user-bar-level {
  display: block;
  font-size: 20rpx;
  color: var(--ink-500);
  margin-top: 4rpx;
}
.home-user-bar-right {
  display: flex;
  align-items: center;
  gap: 28rpx;
}
.home-user-bar-stat {
  text-align: center;
}
.home-user-bar-stat-num {
  font-family: var(--font-num);
  font-size: 36rpx;
  font-weight: 700;
  color: var(--abao-red);
}
.home-user-bar-stat-label {
  display: block;
  font-size: 22rpx;
  color: var(--ink-500);
}
.home-user-bar-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx 0;
  width: 100%;
}
.home-user-bar-login-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--abao-red);
}
.home-user-bar-login-arrow {
  font-size: 32rpx;
  color: var(--abao-red);
}
</style>
