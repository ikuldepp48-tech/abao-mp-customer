<template>
  <view class="confirm-page">
    <!-- 顶部导航 -->
    <AbaoNavBar title="确认订单" :showBack="true" />

    <!-- 门店+桌台信息 -->
    <AbaoCard class="place-card">
      <view class="place-row">
        <text class="place-label">门店</text>
        <text class="place-value">{{ storeStore.storeName || '阿堡' }}</text>
      </view>
      <view class="place-row" v-if="tableStore.tableNo">
        <text class="place-label">桌台</text>
        <text class="place-value">{{ tableStore.tableNo }}{{ tableStore.area ? '（' + tableStore.area + '）' : '' }}</text>
      </view>
      <view class="place-row">
        <text class="place-label">就餐人数</text>
        <view class="diner-picker">
          <view class="diner-btn" @click="dinerCount > 1 && dinerCount--">-</view>
          <text class="diner-num">{{ dinerCount }}</text>
          <view class="diner-btn" @click="dinerCount < 12 && dinerCount++">+</view>
        </view>
      </view>
    </AbaoCard>

    <!-- 订单明细 -->
    <AbaoCard class="order-card">
      <view class="order-item" v-for="item in cartStore.localItems" :key="item.cartItemId">
        <view class="item-main">
          <text class="item-name">{{ item.spuName }}</text>
          <text class="item-sku" v-if="item.skuName">{{ item.skuName }}</text>
          <text class="item-addons" v-if="item.addons && item.addons.length">
            {{ item.addons.map(a => a.name).join('、') }}
          </text>
        </view>
        <view class="item-right">
          <text class="item-price">¥{{ (item.unitPrice + (item.addons || []).reduce((s, a) => s + (a.extraPrice || 0), 0)).toFixed(2) }}</text>
          <text class="item-qty">x{{ item.quantity }}</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="remark-row">
        <text class="remark-label">备注</text>
        <uni-easyinput
          maxlength="50"
          placeholder="如有特殊要求请填写"
          v-model="remark"
          :inputBorder="false"
          :clearable="false"
        />
      </view>
    </AbaoCard>

    <!-- 金额汇总 -->
    <AbaoCard class="price-card">
      <view class="price-row">
        <text class="price-label">商品金额</text>
        <text class="price-value">¥{{ totalAmount.toFixed(2) }}</text>
      </view>
      <view class="price-row" v-if="discountAmount > 0">
        <text class="price-label">优惠金额</text>
        <text class="price-value price-red">-¥{{ discountAmount.toFixed(2) }}</text>
      </view>
      <view class="price-row price-total">
        <text class="price-label">实付金额</text>
        <text class="price-value price-red price-big">¥{{ payAmount.toFixed(2) }}</text>
      </view>
    </AbaoCard>

    <!-- 底部提交 -->
    <view class="footer-box">
      <view class="footer-left">
        <text class="footer-label">合计：</text>
        <text class="footer-price">¥{{ payAmount.toFixed(2) }}</text>
      </view>
      <button class="submit-btn" :disabled="submitting" @tap="onSubmit">
        {{ submitting ? '提交中...' : '提交订单' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import sheep from '@/sheep';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';
import OrderApi from '@/sheep/api/restaurant/restaurant_order';
import PayOrderApi from '@/sheep/api/pay/order';

const storeStore = sheep.$store('store');
const tableStore = sheep.$store('table');
const cartStore = sheep.$store('cart');

const dinerCount = ref(1);
const remark = ref('');
const submitting = ref(false);

const totalAmount = computed(() => cartStore.totalPrice);
const discountAmount = computed(() => 0);
const payAmount = computed(() => totalAmount.value - discountAmount.value);

function genClientOrderNo() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL${ts}${rand}`;
}

async function onSubmit() {
  if (submitting.value) return;
  if (cartStore.localIsEmpty) {
    sheep.$helper.toast('购物车是空的');
    return;
  }
  if (!storeStore.storeId) {
    sheep.$helper.toast('门店信息缺失，请重新扫码');
    return;
  }

  submitting.value = true;
  try {
    const items = cartStore.localItems.map(item => ({
      skuId: item.skuId || 0,
      quantity: item.quantity,
      addons: (item.addons || []).map(a => ({
        id: a.id || 0,
        name: a.name,
        price: a.extraPrice || 0,
      })),
      customerRemark: item.remark || '',
    }));

    // 1. 创建订单
    const { code, data } = await OrderApi.createOrder({
      storeId: storeStore.storeId,
      tableId: tableStore.tableId || 0,
      orderType: 1,
      dinerCount: dinerCount.value,
      items,
      remark: remark.value,
      clientOrderNo: genClientOrderNo(),
    });

    if (code !== 0 || !data) return;

    cartStore.clearLocalCart();

    // 2. 发起微信小程序支付
    if (data.payOrderId) {
      try {
        const openid = await sheep.$platform.useProvider('wechat').getOpenid(true);
        if (openid) {
          const payRes = await PayOrderApi.submitOrder({
            id: data.payOrderId,
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
                sheep.$router.redirect('/pages/order/detail', { id: data.id });
              },
              fail: (err) => {
                if (err.errMsg !== 'requestPayment:fail cancel') {
                  console.error('pay fail:', err);
                }
                sheep.$router.redirect('/pages/order/detail', { id: data.id });
              },
            });
            return;
          }
        }
      } catch (e) {
        console.error('pay error:', e);
      }
    }

    // 支付未发起，直接跳订单详情
    sheep.$router.redirect('/pages/order/detail', { id: data.id });
  } catch (e) {
    console.error('submit order error:', e);
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.confirm-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 120rpx;
}

.place-card {
  margin: 16rpx;
}

.place-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;

  &:not(:last-child) {
    border-bottom: 0.5px solid var(--ink-100);
  }
}

.place-label {
  font-size: 28rpx;
  color: var(--ink-500);
}

.place-value {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink-900);
}

.diner-picker {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.diner-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 1px solid var(--ink-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--ink-700);
}

.diner-num {
  font-size: 30rpx;
  font-weight: 700;
  min-width: 48rpx;
  text-align: center;
  color: var(--ink-900);
}

.order-card {
  margin: 0 16rpx 16rpx;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx 0;

  &:not(:last-child) {
    border-bottom: 0.5px solid var(--ink-100);
  }
}

.item-main {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink-900);
}

.item-sku {
  font-size: 24rpx;
  color: var(--ink-500);
  margin-left: 8rpx;
}

.item-addons {
  font-size: 22rpx;
  color: var(--ink-300);
  display: block;
  margin-top: 4rpx;
}

.item-right {
  text-align: right;
  margin-left: 20rpx;
}

.item-price {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink-900);
  font-family: var(--font-num);
}

.item-qty {
  font-size: 24rpx;
  color: var(--ink-500);
  display: block;
  margin-top: 4rpx;
}

.remark-row {
  display: flex;
  align-items: center;
  padding-top: 20rpx;
  border-top: 0.5px solid var(--ink-100);
  margin-top: 10rpx;
}

.remark-label {
  font-size: 28rpx;
  color: var(--ink-500);
  width: 80rpx;
}

:deep() {
  .uni-input-wrapper {
    flex: 1;
  }

  .uni-easyinput__content-input {
    font-size: 26rpx;
    text-align: right !important;
    padding-right: 0 !important;
    color: var(--ink-900);
  }
}

.price-card {
  margin: 0 16rpx 16rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}

.price-label {
  font-size: 28rpx;
  color: var(--ink-500);
}

.price-value {
  font-size: 28rpx;
  color: var(--ink-900);
  font-family: var(--font-num);
}

.price-red {
  color: var(--abao-red);
}

.price-big {
  font-size: 32rpx;
  font-weight: 700;
}

.price-total {
  border-top: 0.5px solid var(--ink-100);
  margin-top: 8rpx;
  padding-top: 16rpx;
}

.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 100rpx;
  background: #fff;
  border-top: 0.5px solid var(--ink-200);
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.footer-left {
  display: flex;
  align-items: baseline;
}

.footer-label {
  font-size: 28rpx;
  color: var(--ink-900);
}

.footer-price {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.submit-btn {
  width: 220rpx;
  height: 72rpx;
  background: var(--abao-red);
  color: #fff;
  border-radius: var(--r-pill);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 72rpx;
  border: none;
  box-shadow: var(--shadow-red);

  &[disabled] {
    background: var(--ink-300);
    box-shadow: none;
  }
}
</style>
