<template>
  <s-layout title="订单详情" navbar="inner">
    <!-- 状态头部 -->
    <view class="status-header">
      <view class="status-text">{{ statusLabel }}</view>
      <view class="status-desc">{{ statusDesc }}</view>
    </view>

    <!-- 进度条 -->
    <view class="progress-bar" v-if="state.orderInfo.status !== 5">
      <view
        v-for="(step, idx) in steps"
        :key="idx"
        class="progress-step"
        :class="{
          passed: idx < currentStep,
          current: idx === currentStep,
          future: idx > currentStep
        }"
      >
        <view class="step-dot" />
        <view class="step-line" v-if="idx < steps.length - 1" />
        <text class="step-label">{{ step }}</text>
      </view>
    </view>
    <view class="cancelled-bar" v-else>
      <view class="cancelled-dot" />
      <text class="cancelled-text">订单已取消</text>
    </view>

    <!-- 订单商品 -->
    <view class="detail-card ss-m-20">
      <view class="detail-item" v-for="item in (state.orderInfo.items || [])" :key="item.skuId">
        <view class="item-left">
          <text class="item-name">{{ item.spuName || '菜品' }}</text>
          <text class="item-sku" v-if="item.skuName">{{ item.skuName }}</text>
          <text class="item-addons" v-if="item.addonsDesc && item.addonsDesc !== '[]'">{{ item.addonsDesc }}</text>
        </view>
        <view class="item-right">
          <text class="item-price">¥{{ item.unitPrice }}</text>
          <text class="item-qty">x{{ item.quantity }}</text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card ss-m-20">
      <view class="info-row">
        <text class="info-label">订单编号</text>
        <view class="info-right">
          <text class="info-value">{{ state.orderInfo.orderNo }}</text>
          <button class="copy-btn" @tap="onCopy">复制</button>
        </view>
      </view>
      <view class="info-row">
        <text class="info-label">下单时间</text>
        <text class="info-value">{{ formatTime(state.orderInfo.createTime) }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">支付方式</text>
        <text class="info-value">{{ state.orderInfo.payStatus === 1 ? '到店支付' : '待支付' }}</text>
      </view>
    </view>

    <!-- 金额信息 -->
    <view class="price-card ss-m-20">
      <view class="price-row">
        <text class="price-label">原价</text>
        <text class="price-value">¥{{ (state.orderInfo.originalAmount || 0).toFixed(2) }}</text>
      </view>
      <view class="price-row price-total">
        <text class="price-label">实付</text>
        <text class="price-value price-red price-big">¥{{ (state.orderInfo.payAmount || 0).toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <su-fixed bottom placeholder bg="bg-white">
      <view class="footer-box ss-flex ss-row-right ss-col-center ss-p-r-20">
        <button
          v-if="state.orderInfo.status === 0"
          class="action-btn cancel-btn"
          @tap="onCancel"
        >
          取消订单
        </button>
        <button
          v-if="state.orderInfo.status === 0"
          class="action-btn pay-btn"
          @tap="onPay"
        >
          确认支付
        </button>
        <button
          class="action-btn back-btn"
          @tap="onBackHome"
        >
          返回首页
        </button>
      </view>
    </su-fixed>
  </s-layout>
</template>

<script setup>
import { reactive, computed, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import OrderApi from '@/sheep/api/restaurant/restaurant_order';
import PayOrderApi from '@/sheep/api/pay/order';

const steps = ['待支付', '已支付', '备餐中', '已出餐', '已完成'];

const state = reactive({
  orderInfo: {},
});

const statusLabel = computed(() => {
  const map = { 0: '待支付', 1: '已支付', 2: '备餐中', 3: '已出餐', 4: '已完成', 5: '已取消' };
  return map[state.orderInfo.status] || '未知';
});

const statusDesc = computed(() => {
  const map = {
    0: '订单已提交，请尽快完成支付',
    1: '已支付，等待商家接单',
    2: '商家正在备餐中',
    3: '餐品已出餐，请取餐',
    4: '订单已完成，欢迎再次光临',
    5: '订单已取消',
  };
  return map[state.orderInfo.status] || '';
});

const currentStep = computed(() => {
  const s = state.orderInfo.status;
  if (s === 5) return -1; // 已取消
  return s || 0;
});

function formatTime(time) {
  if (!time) return '-';
  return time.replace('T', ' ').substring(0, 19);
}

function onCopy() {
  sheep.$helper.copyText(state.orderInfo.orderNo || '');
}

async function getOrderDetail(id) {
  const { code, data } = await OrderApi.getOrderDetail(id);
  if (code === 0 && data) {
    state.orderInfo = data;
  } else {
    sheep.$helper.toast('订单不存在');
  }
}

function onCancel() {
  uni.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: async (res) => {
      if (!res.confirm) return;
      const { code } = await OrderApi.cancelOrder(state.orderInfo.id);
      if (code === 0) {
        await getOrderDetail(state.orderInfo.id);
      }
    },
  });
}

let pollTimer = null;

async function onPay() {
  if (!state.orderInfo.payOrderId) {
    sheep.$helper.toast('支付单未创建');
    return;
  }
  try {
    const openid = await sheep.$platform.useProvider('wechat').getOpenid(true);
    if (!openid) {
      sheep.$helper.toast('获取用户信息失败，请重试');
      return;
    }
    const payRes = await PayOrderApi.submitOrder({
      id: state.orderInfo.payOrderId,
      channelCode: 'wx_lite',
      channelExtras: { openid },
    });
    if (payRes.code === 0 && payRes.data) {
      const payConfig = JSON.parse(payRes.data.displayContent);
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: payConfig.timeStamp,
        nonceStr: payConfig.nonceStr,
        package: payConfig.packageValue,
        signType: payConfig.signType,
        paySign: payConfig.paySign,
        success: () => {
          getOrderDetail(state.orderInfo.id);
        },
        fail: (err) => {
          if (err.errMsg !== 'requestPayment:fail cancel') {
            console.error('pay fail:', err);
          }
        },
      });
    }
  } catch (e) {
    console.error('pay error:', e);
    sheep.$helper.toast('支付失败，请重试');
  }
}

function startPayPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    if (!state.orderInfo.payOrderId) return;
    const payRes = await PayOrderApi.getOrder(state.orderInfo.payOrderId, false);
    if (payRes.code === 0 && payRes.data) {
      const payStatus = payRes.data.status;
      // 支付成功或已退款，刷新订单详情
      if (payStatus === 20 || payStatus === 30) {
        clearInterval(pollTimer);
        pollTimer = null;
        await getOrderDetail(state.orderInfo.id);
      }
    }
  }, 3000);
}

function onBackHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

onLoad((options) => {
  if (options.id) {
    state.orderInfo.id = options.id;
    getOrderDetail(options.id).then(() => {
      // 订单待支付时，启动轮询
      if (state.orderInfo.status === 0 && state.orderInfo.payOrderId) {
        startPayPolling();
      }
    });
  }
});

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
});
</script>

<style lang="scss" scoped>
.status-header {
  background: linear-gradient(135deg, $red, #E85D3A);
  padding: 40rpx 30rpx 30rpx;
  color: #fff;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.status-desc {
  font-size: 26rpx;
  opacity: 0.9;
}

.progress-bar {
  display: flex;
  background: #fff;
  padding: 30rpx 40rpx;
  align-items: flex-start;
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #ddd;
  z-index: 1;
}

.step-line {
  position: absolute;
  top: 12rpx;
  left: 50%;
  width: 100%;
  height: 4rpx;
  background: #ddd;
  z-index: 0;
}

/* 已过：绿色 */
.progress-step.passed .step-dot {
  background: #07c160;
}
.progress-step.passed .step-line {
  background: #07c160;
}
.progress-step.passed .step-label {
  color: #07c160;
}

/* 当前：红色 */
.progress-step.current .step-dot {
  background: $red;
}
.progress-step.current .step-label {
  color: $red;
  font-weight: 500;
}

/* 未来：灰色 */
.progress-step.future .step-dot {
  background: #ddd;
}
.progress-step.future .step-line {
  background: #ddd;
}
.progress-step.future .step-label {
  color: #bbb;
}

/* 已取消 */
.cancelled-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 30rpx 40rpx;
}

.cancelled-dot {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: $dark-9;
}

.cancelled-text {
  font-size: 24rpx;
  color: $dark-9;
  margin-top: 10rpx;
}

.detail-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;

  &:not(:last-child) {
    border-bottom: 1rpx solid #f5f5f5;
  }
}

.item-left {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $dark-3;
}

.item-sku {
  font-size: 24rpx;
  color: $dark-9;
  margin-left: 8rpx;
}

.item-addons {
  font-size: 22rpx;
  color: $dark-a;
  display: block;
  margin-top: 4rpx;
}

.item-right {
  text-align: right;
  margin-left: 20rpx;
}

.item-price {
  font-size: 28rpx;
  font-weight: 500;
}

.item-qty {
  font-size: 24rpx;
  color: $dark-9;
  display: block;
  margin-top: 4rpx;
}

.info-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14rpx 0;

  &:not(:last-child) {
    border-bottom: 1rpx solid #f5f5f5;
  }
}

.info-label {
  font-size: 28rpx;
  color: $dark-9;
}

.info-right {
  display: flex;
  align-items: center;
}

.info-value {
  font-size: 28rpx;
  color: $dark-3;
}

.copy-btn {
  width: 80rpx;
  height: 44rpx;
  line-height: 44rpx;
  background: #eee;
  border-radius: 22rpx;
  font-size: 22rpx;
  color: $dark-6;
  border: none;
  margin-left: 16rpx;
  padding: 0;
}

.price-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}

.price-label {
  font-size: 28rpx;
  color: $dark-9;
}

.price-value {
  font-size: 28rpx;
  color: $dark-3;
}

.price-red {
  color: $red;
}

.price-big {
  font-size: 32rpx;
  font-weight: bold;
}

.price-total {
  border-top: 1rpx solid #f5f5f5;
  margin-top: 8rpx;
  padding-top: 16rpx;
}

.footer-box {
  height: 100rpx;
}

.action-btn {
  width: 160rpx;
  height: 60rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  border: none;
  margin-left: 20rpx;
  line-height: 60rpx;
  padding: 0;
}

.cancel-btn {
  background: #eee;
  color: $dark-6;
}

.pay-btn {
  background: $red;
  color: #fff;
}

.back-btn {
  background: #eee;
  color: $dark-6;
}
</style>
