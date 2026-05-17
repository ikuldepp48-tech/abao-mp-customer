<template>
  <view class="detail-page">
    <!-- 顶部导航 -->
    <AbaoNavBar title="商品详情" :showBack="true" />

    <!-- 顶部图片轮播 -->
    <view class="image-area" v-if="!loading && !loadError">
      <su-swiper
        :list="dishImages"
        dotStyle="tag"
        :autoplay="true"
        :interval="4000"
        :height="500"
        imageMode="aspectFill"
      />
    </view>

    <!-- 加载中 -->
    <view v-if="loading" style="padding: 16rpx;">
      <LoadingSkeleton variant="detail" :count="1" />
    </view>

    <!-- 加载失败 -->
    <view v-if="loadError" class="error-view">
      <ErrorState errorType="network" retryText="重新加载" @retry="retryLoad" />
    </view>

    <!-- 菜品信息 -->
    <AbaoCard class="dish-section" v-if="!loading && !loadError">
      <view class="dish-title-row">
        <text class="dish-title">{{ dish.name }}</text>
        <AbaoChip v-if="dish.isSoldOut" text="沽清" variant="outline" />
      </view>
      <text class="dish-sub" v-if="dish.subtitle">{{ dish.subtitle }}</text>
      <view class="dish-meta">
        <text class="dish-price-main">¥{{ totalPrice }}</text>
        <text class="dish-sold" v-if="dish.salesCount">已售{{ dish.salesCount }}份</text>
      </view>
    </AbaoCard>

    <!-- 规格选择 -->
    <AbaoCard class="option-section" v-if="!loading && !loadError && dish.skus && dish.skus.length > 1">
      <text class="option-title">规格</text>
      <view class="option-list">
        <view
          v-for="sku in dish.skus"
          :key="sku.id"
          class="option-tag"
          :class="{ selected: selectedSku && selectedSku.id === sku.id }"
          @click="selectSku(sku)"
        >
          {{ sku.name }}
          <text class="sku-price" v-if="sku.price">+¥{{ sku.price }}</text>
        </view>
      </view>
    </AbaoCard>

    <!-- 加料选择 -->
    <AbaoCard class="option-section" v-for="group in (dish.addons || [])" :key="group.groupName" v-if="!loading && !loadError">
      <text class="option-title">
        {{ group.groupName }}
        <AbaoChip v-if="group.isRequired" text="必选" variant="red" />
      </text>
      <view class="option-list">
        <view
          v-for="opt in (group.options || [])"
          :key="opt.id"
          class="option-tag"
          :class="{ selected: isAddonSelected(opt.id) }"
          @click="toggleAddon(opt, group.isMulti)"
        >
          {{ opt.name }}
          <text class="addon-price" v-if="opt.extraPrice">+¥{{ opt.extraPrice }}</text>
        </view>
      </view>
    </AbaoCard>

    <!-- 备注 -->
    <AbaoCard class="remark-section" v-if="!loading && !loadError">
      <text class="option-title">备注</text>
      <input
        class="remark-input"
        placeholder="如：少辣、不要香菜"
        v-model="remark"
        maxlength="50"
      />
    </AbaoCard>

    <!-- 截图调试栏 -->
    <view class="debug-bar">
      <view class="debug-btn" :class="{ on: loading }" @click="debugSet('loading')"><text>加载中</text></view>
      <view class="debug-btn" :class="{ on: loadError }" @click="debugSet('error')"><text>加载失败</text></view>
      <view class="debug-btn" :class="{ on: !loading && !loadError }" @click="debugSet('normal')"><text>正常</text></view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="!loading && !loadError">
      <view class="quantity-row">
        <view class="qty-btn" @click="quantity > 1 && quantity--">−</view>
        <text class="qty-num">{{ quantity }}</text>
        <view class="qty-btn" @click="quantity++">+</view>
      </view>
      <view class="submit-btn" :class="{ disabled: !canSubmit }" @click="addToCart">
        <text class="submit-text">{{ dish.isSoldOut ? '已沽清' : '加入购物车 ¥' + (totalPrice * quantity) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';
import AbaoChip from '@/components/abao/AbaoChip.vue';
import LoadingSkeleton from '@/components/abao/LoadingSkeleton.vue';
import ErrorState from '@/components/abao/ErrorState.vue';

const menuStore = sheep.$store('menu');
const cartStore = sheep.$store('cart');

const loading = ref(false);
const loadError = ref(false);
const dish = ref({});
const selectedSku = ref(null);
const selectedAddons = ref([]);
const remark = ref('');
const quantity = ref(1);

const totalPrice = computed(() => {
  let price = 0;
  if (selectedSku.value) {
    price = selectedSku.value.price || 0;
  } else if (dish.value.minPrice) {
    price = dish.value.minPrice;
  }
  selectedAddons.value.forEach((a) => {
    price += a.extraPrice || 0;
  });
  return price;
});

const canSubmit = computed(() => {
  if (dish.value.isSoldOut) return false;
  for (const group of (dish.value.addons || [])) {
    if (group.isRequired) {
      const has = selectedAddons.value.some((a) => a.groupName === group.groupName);
      if (!has) return false;
    }
  }
  return true;
});

const dishImages = computed(() => {
  if (!dish.value.coverUrl) return [{ type: 'image', src: '/static/logo.png' }];
  return [{ type: 'image', src: dish.value.coverUrl }];
});

// debug
const isDebug = ref(false);
function debugSet(state) {
  isDebug.value = true;
  if (state === 'loading') { loading.value = true; loadError.value = false; return; }
  if (state === 'error') { loadError.value = true; loading.value = false; return; }
  if (state === 'normal') { isDebug.value = false; loadError.value = false; loading.value = false; dish.value = { name:'调试菜品', minPrice:32, spuId:1, coverUrl:'/static/logo.png', skus:[], addons:[] }; return; }
}

onLoad(async (options) => {
  if (isDebug.value) return;
  const spuId = Number(options.spuId);
  let data = menuStore.getDishById(spuId);

  // 菜单未加载 → 尝试远程获取
  if (!data) {
    loading.value = true;
    try {
      await menuStore.fetchMenu();
      data = menuStore.getDishById(spuId);
      loadError.value = !data;
    } catch {
      loadError.value = true;
    }
    loading.value = false;
  }

  if (!data) {
    if (!loadError.value) {
      uni.showToast({ title: '菜品不存在', icon: 'none' });
      setTimeout(() => uni.navigateBack(), 800);
    }
    return;
  }
  dish.value = data;
  if (data.skus && data.skus.length > 0) {
    selectedSku.value = data.skus[0];
  }
});

function retryLoad() {
  // 重新触发 onLoad 逻辑
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  if (page?.options?.spuId) {
    loadError.value = false;
    const spuId = Number(page.options.spuId);
    loading.value = true;
    menuStore.fetchMenu().then(() => {
      const data = menuStore.getDishById(spuId);
      if (data) {
        dish.value = data;
        if (data.skus && data.skus.length > 0) {
          selectedSku.value = data.skus[0];
        }
        loadError.value = false;
      } else {
        loadError.value = true;
      }
      loading.value = false;
    }).catch(() => {
      loadError.value = true;
      loading.value = false;
    });
  }
}

function selectSku(sku) {
  selectedSku.value = sku;
}

function isAddonSelected(addonId) {
  return selectedAddons.value.some((a) => a.id === addonId);
}

function toggleAddon(opt, isMulti) {
  const idx = selectedAddons.value.findIndex((a) => a.id === opt.id);
  if (idx >= 0) {
    selectedAddons.value.splice(idx, 1);
  } else {
    if (!isMulti) {
      // 单选：清除同组其他选项
      selectedAddons.value = selectedAddons.value.filter(
        (a) => a.groupName !== opt.groupName
      );
    }
    selectedAddons.value.push({ ...opt });
  }
}

function addToCart() {
  if (dish.value.isSoldOut) return;
  // 校验必选加料
  for (const group of (dish.value.addons || [])) {
    if (group.isRequired) {
      const hasSelected = selectedAddons.value.some((a) => a.groupName === group.groupName);
      if (!hasSelected) {
        uni.showToast({ title: `请选择${group.groupName}`, icon: 'none' });
        return;
      }
    }
  }

  cartStore.addItem({
    spuId: dish.value.spuId,
    spuName: dish.value.name,
    coverUrl: dish.value.coverUrl,
    skuId: selectedSku.value?.id,
    skuName: selectedSku.value?.name || '',
    unitPrice: selectedSku.value?.price || totalPrice.value,
    addons: selectedAddons.value.map((a) => ({
      id: a.id,
      name: a.name,
      extraPrice: a.extraPrice || 0,
      groupName: a.groupName,
    })),
    remark: remark.value,
    quantity: quantity.value,
  });

  uni.showToast({ title: '已加入购物车', icon: 'none' });
  setTimeout(() => uni.navigateBack(), 500);
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 120rpx;
}

.debug-bar { position:fixed; bottom:120rpx; left:50%; transform:translateX(-50%); display:flex; gap:12rpx; z-index:999; }
.debug-btn { padding:8rpx 20rpx; border-radius:999px; background:rgba(0,0,0,.6); font-size:22rpx; color:#fff; }
.debug-btn.on { background:var(--abao-red); }

.image-area {
  width: 100%;
}

.dish-section {
  margin: 16rpx;
}

.dish-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.dish-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--ink-900);
  font-family: var(--font-display);
}

.dish-sub {
  font-size: 24rpx;
  color: var(--ink-500);
  margin-top: 8rpx;
  display: block;
}

.dish-meta {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.dish-price-main {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.dish-sold {
  font-size: 22rpx;
  color: var(--ink-500);
  margin-left: 16rpx;
}

.option-section {
  margin: 0 16rpx 8rpx;
}

.option-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--ink-900);
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.option-tag {
  padding: 12rpx 24rpx;
  border-radius: var(--r-sm);
  border: 1px solid var(--ink-200);
  font-size: 26rpx;
  color: var(--ink-700);
  background: var(--ink-100);

  &.selected {
    border-color: var(--abao-red);
    color: var(--abao-red);
    background: var(--abao-red-soft);
  }
}

.sku-price, .addon-price {
  font-size: 22rpx;
  color: var(--abao-red);
  margin-left: 4rpx;
}

.remark-section {
  margin: 0 16rpx 16rpx;
}

.remark-input {
  width: 100%;
  height: 60rpx;
  border: 1px solid var(--ink-200);
  border-radius: var(--r-sm);
  padding: 0 16rpx;
  font-size: 26rpx;
  color: var(--ink-900);
  background: var(--ink-100);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg);
  padding: 16rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 0.5px solid var(--ink-200);
  box-shadow: var(--shadow-md);
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.qty-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 1px solid var(--ink-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: var(--ink-700);
}

.qty-num {
  font-size: 30rpx;
  font-weight: 700;
  min-width: 40rpx;
  text-align: center;
  color: var(--ink-900);
}

.error-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.submit-btn {
  padding: 16rpx 48rpx;
  background: var(--abao-red);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-red);

  &.disabled {
    background: var(--ink-300);
    box-shadow: none;
  }
}

.submit-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}
</style>
