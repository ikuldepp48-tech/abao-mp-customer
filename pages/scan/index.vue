<template>
  <view class="scan-page">
    <view class="scan-content" v-if="status === 'loading'">
      <su-image src="/static/logo.png" :width="200" :height="200" borderRadius="20rpx" />
      <text class="scan-text">识别桌台中...</text>
      <text class="scan-sub">请稍候</text>
    </view>

    <view class="scan-content" v-if="status === 'error'">
      <text class="scan-icon">✗</text>
      <text class="scan-text">桌台识别失败</text>
      <text class="scan-sub">{{ errorMsg }}</text>
      <button class="scan-btn" @click="handleRetry">重新扫码</button>
    </view>

    <view class="scan-content" v-if="status === 'success'">
      <text class="scan-icon">✓</text>
      <text class="scan-text">欢迎光临</text>
      <text class="scan-sub">{{ storeName }} {{ tableNo }}桌</text>
      <text class="scan-desc">正在进入菜单...</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import TableApi from '@/sheep/api/restaurant/restaurant_table';
import $store from '@/sheep/store';
import sheep from '@/sheep';

const status = ref('loading'); // loading | success | error
const errorMsg = ref('');
const storeName = ref('');
const tableNo = ref('');

onLoad(async (options) => {
  const { token } = options;

  if (!token) {
    status.value = 'error';
    errorMsg.value = '二维码无效，请扫桌台上的点餐二维码';
    return;
  }

  await doScan(token);
});

async function doScan(token) {
  try {
    const { code, msg, data } = await TableApi.scanTable(token);
    if (code !== 0 || !data) {
      status.value = 'error';
      errorMsg.value = msg || '桌台信息无效，请联系店员';
      return;
    }

    // 存储租户ID
    if (data.tenantId) {
      uni.setStorageSync('tenant-id', data.tenantId);
    }

    // 存储门店信息
    const storeStore = $store('store');
    storeStore.setStore(data.storeId, data.storeName);

    // 存储桌台信息
    const tableStore = $store('table');
    tableStore.setTable(data.tableId, data.tableNo, data.area, data.seatCapacity);

    storeName.value = data.storeName;
    tableNo.value = data.tableNo;
    status.value = 'success';

    // 确保已登录（静默微信登录）
    const userStore = $store('user');
    if (!userStore.isLogin) {
      await sheep.$platform.useProvider('wechat').login();
    }

    // 延迟跳转首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 800);
  } catch (e) {
    status.value = 'error';
    errorMsg.value = '网络异常，请检查网络后重试';
  }
}

function handleRetry() {
  uni.scanCode({
    success: (res) => {
      // 解析二维码URL：scan?token=xxx
      const url = res.result;
      const params = {};
      if (url.includes('?')) {
        const query = url.split('?')[1];
        query.split('&').forEach((pair) => {
          const [k, v] = pair.split('=');
          params[k] = decodeURIComponent(v);
        });
      }
      if (params.token) {
        status.value = 'loading';
        doScan(params.token);
      } else {
        errorMsg.value = '请扫描桌台上的点餐二维码';
      }
    },
    fail: () => {
      // 用户取消扫码
    },
  });
}
</script>

<style lang="scss" scoped>
.scan-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f6f6f6;
  padding: 40rpx;
}

.scan-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan-icon {
  font-size: 100rpx;
  margin-bottom: 40rpx;
  color: $red;
}

.scan-text {
  font-size: 36rpx;
  font-weight: bold;
  color: $dark-3;
  margin-bottom: 16rpx;
}

.scan-sub {
  font-size: 28rpx;
  color: $dark-6;
  margin-bottom: 40rpx;
}

.scan-desc {
  font-size: 24rpx;
  color: $dark-9;
}

.scan-btn {
  margin-top: 40rpx;
  padding: 20rpx 60rpx;
  background: $red;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
}
</style>
