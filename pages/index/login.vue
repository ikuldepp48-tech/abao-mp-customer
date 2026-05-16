<template>
  <view class="login-page">
    <view class="login-content">
      <!-- [1] 品牌 Logo + 欢迎语 -->
      <view class="login-brand">
        <AbaoLogo size="lg" />
        <text class="login-title">欢迎来到阿堡</text>
        <text class="login-subtitle">温馨提示</text>
      </view>

      <!-- [2] 隐私协议 — AbaoCard 组件化 -->
      <AbaoCard variant="minimal">
        <text class="login-privacy-text">
          我们依据相关法律法规制定了 <text class="login-link">《阿堡用户协议》</text> 和 <text class="login-link">《阿堡隐私协议》</text>。请您在使用我们的产品前，仔细阅读并充分理解相关条款。
        </text>
        <text class="login-privacy-text login-privacy-text--bold">我们承诺严格遵循最小必要原则，仅在使用具体功能（如下单支付、配送收货）时收集所需信息。</text>
      </AbaoCard>

      <!-- [3] 同意勾选 -->
      <view class="login-agree" @click="agreed = !agreed">
        <view class="login-agree-check" :class="{ checked: agreed }">
          <text v-if="agreed" class="login-agree-check-icon">✓</text>
        </view>
        <text class="login-agree-text">我已阅读并同意《阿堡用户协议》《阿堡隐私协议》</text>
      </view>

      <!-- 新人福利提示（互惠） -->
      <view v-if="loadingState === 'idle'" class="login-reward">
        <text class="login-reward-text">注册即享新人专属优惠券</text>
      </view>

      <!-- [4] 按钮组 — Capsule 组件化 -->
      <view v-if="loadingState === 'idle'" class="login-buttons">
        <Capsule text="拒绝并退出" variant="ghost" size="lg" @click="handleReject" />
        <Capsule
          :text="agreed ? '同意并登录' : '请先同意协议'"
          :variant="agreed ? 'filled' : 'outline'"
          size="lg"
          @click="handleAgree"
        />
      </view>

      <!-- [5] 微信登录提示 -->
      <view v-if="loadingState === 'idle'" class="login-wechat-tip" @click="handleAgree">
        <text class="login-wechat-icon">💬</text>
        <view class="login-wechat-info">
          <text class="login-wechat-title">使用微信一键登录</text>
          <text class="login-wechat-desc">方便快捷 · 保障账号安全</text>
        </view>
        <text class="login-wechat-arrow">›</text>
      </view>

      <!-- [6] 授权中 — LoadingSkeleton -->
      <view v-if="loadingState === 'authing'" class="login-loading">
        <LoadingSkeleton variant="list" :count="2" />
        <text class="login-loading-text">正在授权中...</text>
      </view>

      <!-- [7] 授权失败 — ErrorState -->
      <view v-if="loadingState === 'error'" class="login-error">
        <ErrorState
          :errorType="errorType"
          :retryText="'重新授权'"
          @retry="handleRetry"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import sheep from '@/sheep'
import AbaoLogo from '@/components/abao/AbaoLogo.vue'
import AbaoCard from '@/components/abao/AbaoCard.vue'
import Capsule from '@/components/abao/Capsule.vue'
import LoadingSkeleton from '@/components/abao/LoadingSkeleton.vue'
import ErrorState from '@/components/abao/ErrorState.vue'

const agreed = ref(false)
const loadingState = ref('idle') // idle | authing | error
const errorType = ref('permission')

async function doLogin() {
  loadingState.value = 'authing'
  try {
    await sheep.$platform.useProvider('wechat').login()
    loadingState.value = 'idle'
    uni.showToast({ title: '欢迎加入阿堡', icon: 'success', duration: 2000 })
    setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 2000)
  } catch (e) {
    loadingState.value = 'error'
    if (e.errMsg && e.errMsg.includes('cancel')) {
      errorType.value = 'permission'
    } else if (e.errMsg && (e.errMsg.includes('timeout') || e.errMsg.includes('network'))) {
      errorType.value = 'network'
    } else {
      errorType.value = 'server'
    }
  }
}

function handleAgree() {
  if (!agreed.value) return
  doLogin()
}

function handleReject() {
  uni.showModal({
    title: '提示',
    content: '需要同意协议才能使用阿堡服务',
    showCancel: false,
  })
}

function handleRetry() {
  loadingState.value = 'idle'
  agreed.value = false
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
}
.login-content {
  padding: 120rpx 48rpx 0;
}

/* [1] 品牌区 */
.login-brand {
  text-align: center;
}
.login-title {
  display: block;
  font-family: var(--font-display);
  font-size: 44rpx;
  font-weight: 800;
  color: var(--ink-900);
  margin-top: 36rpx;
}
.login-subtitle {
  display: block;
  font-family: var(--font-body);
  font-size: 24rpx;
  color: var(--ink-500);
  margin-top: 12rpx;
}

/* [2] 隐私协议 — AbaoCard 包裹，内部仅文本样式 */
.login-privacy-text {
  display: block;
  font-family: var(--font-body);
  font-size: 24rpx;
  color: var(--ink-700);
  line-height: 1.8;
}
.login-privacy-text--bold {
  font-weight: 600;
  margin-top: 16rpx;
}
.login-link {
  color: var(--abao-red);
}

/* [3] 同意勾选 */
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
  flex-shrink: 0;
  margin-top: 4rpx;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.login-agree-check.checked {
  background: var(--abao-red);
  border-color: var(--abao-red);
}
.login-agree-check-icon {
  font-size: 22rpx;
  color: #fff;
}
.login-agree-text {
  font-family: var(--font-body);
  font-size: 22rpx;
  color: var(--ink-700);
}

/* 新人福利提示（互惠） */
.login-reward {
  margin-top: 24rpx;
  text-align: center;
}
.login-reward-text {
  font-family: var(--font-body);
  font-size: 22rpx;
  color: var(--abao-red-deep);
}

/* [4] 按钮组 */
.login-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 32rpx;
}

/* [5] 微信登录提示 */
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
  display: block;
  font-family: var(--font-body);
  font-size: 24rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
}
.login-wechat-desc {
  display: block;
  font-family: var(--font-body);
  font-size: 20rpx;
  color: var(--ink-700);
  margin-top: 4rpx;
}
.login-wechat-arrow {
  font-size: 32rpx;
  color: var(--ink-500);
}

/* [6] 授权中 */
.login-loading {
  margin-top: 60rpx;
  padding: 0 24rpx;
}
.login-loading-text {
  display: block;
  text-align: center;
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-500);
  margin-top: 24rpx;
}

/* [7] 授权失败 */
.login-error {
  margin-top: 60rpx;
}
</style>
