<template>
  <view class="abao-navbar" :class="{ 'abao-navbar--dark': dark }">
    <!-- 状态栏占位（微信胶囊按钮区域） -->
    <view class="abao-navbar__status" :style="{ height: statusBarHeight + 'px' }" />
    <!-- 导航栏 -->
    <view class="abao-navbar__nav">
      <view v-if="showBack" class="abao-navbar__back" @click="onBack">
        <text class="abao-navbar__back-icon">‹</text>
      </view>
      <text class="abao-navbar__title">{{ title }}</text>
      <view class="abao-navbar__right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
})

const emit = defineEmits(['back'])

// 微信状态栏高度（含胶囊按钮区）
const systemInfo = uni.getSystemInfoSync()
const statusBarHeight = systemInfo.statusBarHeight || 44

function onBack() {
  emit('back')
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.abao-navbar {
  flex-shrink: 0;
  background: #fff;
}
.abao-navbar--dark {
  background: transparent;
  .abao-navbar__title { color: #fff; }
  .abao-navbar__back-icon { color: #fff; }
}
.abao-navbar__status {
  width: 100%;
}
.abao-navbar__nav {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: 600;
  font-size: 16px;
  color: var(--ink-900);
}
.abao-navbar__title {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 16px;
  color: var(--ink-900);
}
.abao-navbar__back {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.abao-navbar__back-icon {
  font-size: 18px;
  color: var(--ink-900);
}
.abao-navbar__right {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
</style>
