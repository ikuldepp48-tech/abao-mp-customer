<template>
  <view class="detail-page">
    <!-- 顶部图片 -->
    <view class="image-area">
      <su-image
        :src="dish.coverUrl || '/static/logo.png'"
        width="100%"
        height="500rpx"
        borderRadius="0"
      />
    </view>

    <!-- 菜品信息 -->
    <view class="dish-section">
      <text class="dish-title">{{ dish.name }}</text>
      <text class="dish-sub" v-if="dish.subtitle">{{ dish.subtitle }}</text>
      <view class="dish-meta">
        <text class="dish-price-main">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="option-section" v-if="dish.skus && dish.skus.length > 1">
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
    </view>

    <!-- 加料选择 -->
    <view class="option-section" v-for="group in (dish.addons || [])" :key="group.groupName">
      <text class="option-title">
        {{ group.groupName }}
        <text class="required-tag" v-if="group.isRequired">必选</text>
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
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <text class="option-title">备注</text>
      <input
        class="remark-input"
        placeholder="如：少辣、不要香菜"
        v-model="remark"
        maxlength="50"
      />
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="quantity-row">
        <view class="qty-btn" @click="quantity > 1 && quantity--">-</view>
        <text class="qty-num">{{ quantity }}</text>
        <view class="qty-btn" @click="quantity++">+</view>
      </view>
      <view class="submit-btn" @click="addToCart">加入购物车 ¥{{ totalPrice * quantity }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';

const menuStore = sheep.$store('menu');
const cartStore = sheep.$store('cart');

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
  // 加料价格
  selectedAddons.value.forEach((a) => {
    price += a.extraPrice || 0;
  });
  return price;
});

onLoad((options) => {
  const spuId = Number(options.spuId);
  const data = menuStore.getDishById(spuId);
  if (!data) {
    uni.showToast({ title: '菜品不存在', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 800);
    return;
  }
  dish.value = data;
  // 默认选第一个SKU
  if (data.skus && data.skus.length > 0) {
    selectedSku.value = data.skus[0];
  }
});

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
  background: #f6f6f6;
  padding-bottom: 120rpx;
}

.image-area {
  width: 100%;
}

.dish-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 16rpx;
}

.dish-title {
  font-size: 36rpx;
  font-weight: bold;
  color: $dark-3;
}

.dish-sub {
  font-size: 24rpx;
  color: $dark-9;
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
  font-weight: bold;
  color: $red;
}

.dish-sold {
  font-size: 22rpx;
  color: $dark-a;
  margin-left: 20rpx;
}

.option-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 2rpx;
}

.option-title {
  font-size: 28rpx;
  font-weight: bold;
  color: $dark-3;
  margin-bottom: 16rpx;
  display: block;
}

.required-tag {
  font-size: 20rpx;
  color: $red;
  border: 1rpx solid $red;
  border-radius: 4rpx;
  padding: 2rpx 8rpx;
  margin-left: 8rpx;
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.option-tag {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
  font-size: 26rpx;
  color: $dark-6;
  background: #fafafa;

  &.selected {
    border-color: $red;
    color: $red;
    background: #fff5f5;
  }
}

.sku-price, .addon-price {
  font-size: 22rpx;
  color: $red;
  margin-left: 4rpx;
}

.remark-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 16rpx;
}

.remark-input {
  width: 100%;
  height: 60rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1rpx solid #eee;
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
  border: 1rpx solid #ddd;
  text-align: center;
  line-height: 48rpx;
  font-size: 32rpx;
}

.qty-num {
  font-size: 30rpx;
  font-weight: bold;
  min-width: 40rpx;
  text-align: center;
}

.submit-btn {
  padding: 16rpx 48rpx;
  background: $red;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
