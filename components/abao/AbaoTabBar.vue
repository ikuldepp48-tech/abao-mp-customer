<template>
  <view class="abao-tabbar">
    <view
      v-for="(tab, i) in tabs"
      :key="i"
      class="abao-tabbar__item"
      :class="{
        'abao-tabbar__item--active': current === i,
        'abao-tabbar__item--center': i === 2
      }"
      @click="onTap(i)"
    >
      <view class="abao-tabbar__icon">
        <text v-if="i === 2" class="abao-tabbar__center-text">堡</text>
        <text v-else class="abao-tabbar__icon-text">{{ tab.icon }}</text>
      </view>
      <text class="abao-tabbar__label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue';

const tabs = [
  { label: '首页', icon: '🏠', path: '/pages/index/index' },
  { label: '点餐', icon: '📋', path: '/pages/index/category' },
  { label: '', icon: '', path: '/pages/index/member' },
  { label: '取餐', icon: '🛍', path: '/pages/order/list' },
  { label: '我的', icon: '👤', path: '/pages/index/user' },
];

const current = ref(0);

// 根据当前页面路径判断 active tab
const instance = getCurrentInstance();
if (instance) {
  const routes = getCurrentPages();
  if (routes && routes.length) {
    const currentRoute = '/' + routes[routes.length - 1].route;
    const idx = tabs.findIndex(t => t.path === currentRoute);
    if (idx >= 0) current.value = idx;
  }
}

function onTap(i) {
  if (i === current.value) return;
  const tab = tabs[i];
  if (tab.path) {
    uni.switchTab({ url: tab.path });
  }
}
</script>

<style lang="scss" scoped>
.abao-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: #fff;
  border-top: 0.5px solid var(--ink-200);
  padding: 6px 0 env(safe-area-inset-bottom, 4px);
  flex-shrink: 0;
}
.abao-tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  font-size: 10px;
  color: var(--ink-500);
}
.abao-tabbar__item--active {
  color: var(--abao-red);
}
.abao-tabbar__icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--ink-500);
}
.abao-tabbar__item--active .abao-tabbar__icon {
  color: var(--abao-red);
}
.abao-tabbar__icon-text {
  font-size: 20px;
  line-height: 1;
}
.abao-tabbar__item--center .abao-tabbar__icon {
  width: 48px;
  height: 48px;
  background: var(--abao-red);
  border-radius: 50%;
  margin-top: -16px;
  color: #fff;
  box-shadow: var(--shadow-red);
  font-size: 24px;
  border: 3px solid #fff;
}
.abao-tabbar__center-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: #fff;
}
.abao-tabbar__label {
  font-size: 10px;
}
</style>
