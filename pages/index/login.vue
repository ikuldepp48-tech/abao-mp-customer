<template>
  <view class="login-page">
    <view class="login-content">
      <!-- 品牌 Logo 区 -->
      <view class="login-brand">
        <AbaoLogo size="lg" />
        <text class="login-title">欢迎来到阿堡</text>
        <text class="login-subtitle">温馨提示</text>
      </view>

      <!-- 隐私协议说明 -->
      <view class="login-privacy">
        <text class="login-privacy-text">
          我们依据相关法律法规制定了 <text class="login-link">《阿堡用户协议》</text> 和 <text class="login-link">《阿堡隐私协议》</text>。请您在使用我们的产品前，仔细阅读并充分理解相关条款。
        </text>
        <text class="login-privacy-text login-privacy-text--bold">我们承诺严格遵循最小必要原则，仅在使用具体功能（如下单支付、配送收货）时收集所需信息。</text>
      </view>

      <!-- 同意勾选 -->
      <view class="login-agree" @click="agreed = !agreed">
        <view class="login-agree-check" :class="{ checked: agreed }">
          <text v-if="agreed">✓</text>
        </view>
        <text class="login-agree-text">我已阅读并同意《阿堡用户协议》《阿堡隐私协议》</text>
      </view>

      <!-- 操作按钮 -->
      <view class="login-buttons">
        <button class="login-btn login-btn--ghost" @click="handleReject">拒绝并退出</button>
        <button class="login-btn login-btn--primary" :class="{ disabled: !agreed }" @click="handleAgree">同意并登录</button>
      </view>

      <!-- 微信登录提示 -->
      <view class="login-wechat-tip" @click="handleWechatLogin">
        <text class="login-wechat-icon">💬</text>
        <view class="login-wechat-info">
          <text class="login-wechat-title">使用微信一键登录</text>
          <text class="login-wechat-desc">方便快捷 · 保障账号安全</text>
        </view>
        <text class="login-wechat-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import sheep from '@/sheep';

import AbaoLogo from '@/components/abao/AbaoLogo.vue';

const agreed = ref(false);

async function handleWechatLogin() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意协议', icon: 'none' });
    return;
  }
  try {
    await sheep.$platform.useProvider('wechat').login();
    uni.switchTab({ url: '/' });
  } catch (e) {
    console.error('微信登录失败:', e);
  }
}

function handleAgree() {
  if (!agreed.value) return;
  handleWechatLogin();
}

function handleReject() {
  // 小程序不支持主动退出，返回上一页或提示
  uni.showModal({
    title: '提示',
    content: '需要同意协议才能使用阿堡服务',
    showCancel: false,
  });
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: #fff;
}

.login-content {
  padding: 120rpx 48rpx 0;
}

/* 品牌区 */
.login-brand {
  text-align: center;
}

.login-title {
  display: block;
  font-family: var(--font-display);
  font-size: 44rpx;
  font-weight: 800;
  margin-top: 36rpx;
  color: var(--ink-900);
}

.login-subtitle {
  display: block;
  font-size: 24rpx;
  color: var(--ink-500);
  margin-top: 12rpx;
}

/* 隐私协议 */
.login-privacy {
  margin-top: 44rpx;
  padding: 36rpx;
  background: var(--bg);
  border-radius: var(--r-md);
}

.login-privacy-text {
  font-size: 24rpx;
  color: var(--ink-700);
  line-height: 1.8;
  display: block;
}

.login-privacy-text--bold {
  font-weight: 600;
  margin-top: 16rpx;
}

.login-link {
  color: var(--abao-red);
}

/* 同意勾选 */
.login-agree {
  margin-top: 28rpx;
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

.login-agree-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid var(--ink-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
  color: var(--ink-300);

  &.checked {
    background: var(--abao-red);
    color: #fff;
    border-color: var(--abao-red);
  }
}

.login-agree-text {
  font-size: 22rpx;
  color: var(--ink-700);
}

/* 按钮 */
.login-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 60rpx;
}

.login-btn {
  padding: 28rpx;
  border-radius: var(--r-pill);
  font-size: 28rpx;
  font-weight: 600;
  border: none;

  &--primary {
    background: var(--abao-red);
    color: #fff;
    box-shadow: var(--shadow-red);

    &.disabled {
      background: var(--ink-300);
      box-shadow: none;
    }
  }

  &--ghost {
    background: #fff;
    color: var(--abao-red);
    border: 3rpx solid var(--abao-red);
  }
}

/* 微信登录提示 */
.login-wechat-tip {
  margin-top: 40rpx;
  padding: 28rpx;
  background: var(--abao-yellow-soft);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.login-wechat-icon {
  font-size: 48rpx;
}

.login-wechat-info {
  flex: 1;
}

.login-wechat-title {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
  display: block;
}

.login-wechat-desc {
  font-size: 20rpx;
  color: var(--ink-700);
  margin-top: 4rpx;
  display: block;
}

.login-wechat-arrow {
  font-size: 32rpx;
  color: var(--ink-500);
}
</style>
