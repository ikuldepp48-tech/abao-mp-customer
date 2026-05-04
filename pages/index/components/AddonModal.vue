<template>
  <su-popup :show="visible" type="bottom" @close="handleClose" :height="'70vh'">
    <view class="addon-modal">
      <view class="modal-header">
        <text class="modal-title">{{ dish.name }}</text>
        <text class="modal-close" @click="handleClose">✕</text>
      </view>

      <scroll-view class="modal-body" scroll-y>
        <!-- 规格选择 -->
        <view class="option-section" v-if="dish.skus && dish.skus.length > 1">
          <text class="option-title">规格</text>
          <view class="option-list">
            <view
              v-for="sku in dish.skus"
              :key="sku.id"
              class="option-tag"
              :class="{ selected: selectedSku && selectedSku.id === sku.id }"
              @click="selectedSku = sku"
            >
              {{ sku.name }}
              <text class="price-extra" v-if="sku.price">+¥{{ sku.price }}</text>
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
              @click="toggleAddon(opt, group)"
            >
              {{ opt.name }}
              <text class="price-extra" v-if="opt.extraPrice">+¥{{ opt.extraPrice }}</text>
            </view>
          </view>
        </view>

        <!-- 备注 -->
        <view class="option-section">
          <text class="option-title">备注</text>
          <input
            class="remark-input"
            placeholder="如：少辣、不要香菜"
            v-model="remark"
            maxlength="50"
          />
        </view>

        <!-- 数量 -->
        <view class="option-section">
          <text class="option-title">数量</text>
          <view class="qty-row">
            <view class="qty-btn" @click="quantity > 1 && quantity--">-</view>
            <text class="qty-num">{{ quantity }}</text>
            <view class="qty-btn" @click="quantity++">+</view>
          </view>
        </view>
      </scroll-view>

      <view class="modal-footer">
        <text class="footer-price">¥{{ (totalPrice * quantity).toFixed(2) }}</text>
        <view class="footer-btn" :class="{ disabled: !canSubmit }" @click="handleConfirm">加入购物车</view>
      </view>
    </view>
  </su-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import sheep from '@/sheep';

const props = defineProps({
  visible: { type: Boolean, default: false },
  dish: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close', 'confirm']);

const cartStore = sheep.$store('cart');

const selectedSku = ref(null);
const selectedAddons = ref([]);
const remark = ref('');
const quantity = ref(1);

const totalPrice = computed(() => {
  let price = 0;
  if (selectedSku.value) {
    price = selectedSku.value.price || 0;
  } else if (props.dish.minPrice) {
    price = props.dish.minPrice;
  }
  selectedAddons.value.forEach((a) => {
    price += a.extraPrice || 0;
  });
  return price;
});

const canSubmit = computed(() => {
  for (const group of (props.dish.addons || [])) {
    if (group.isRequired) {
      const has = selectedAddons.value.some((a) => a.groupName === group.groupName);
      if (!has) return false;
    }
  }
  return true;
});

// 弹窗打开时重置状态
watch(() => props.visible, (val) => {
  if (val) {
    const d = props.dish;
    if (d.skus && d.skus.length > 0) {
      selectedSku.value = d.skus[0];
    } else {
      selectedSku.value = null;
    }
    selectedAddons.value = [];
    remark.value = '';
    quantity.value = 1;
  }
});

function isAddonSelected(addonId) {
  return selectedAddons.value.some((a) => a.id === addonId);
}

function toggleAddon(opt, group) {
  const idx = selectedAddons.value.findIndex((a) => a.id === opt.id);
  if (idx >= 0) {
    selectedAddons.value.splice(idx, 1);
  } else {
    if (!group.isMulti) {
      selectedAddons.value = selectedAddons.value.filter(
        (a) => a.groupName !== group.groupName,
      );
    }
    selectedAddons.value.push({ ...opt });
  }
}

function handleConfirm() {
  // 校验必选加料
  for (const group of (props.dish.addons || [])) {
    if (group.isRequired) {
      const hasSelected = selectedAddons.value.some((a) => a.groupName === group.groupName);
      if (!hasSelected) {
        uni.showToast({ title: `请选择${group.groupName}`, icon: 'none' });
        return;
      }
    }
  }

  const sku = selectedSku.value || { id: 0, name: '', price: props.dish.minPrice || 0 };
  cartStore.addItem({
    spuId: props.dish.spuId,
    spuName: props.dish.name,
    coverUrl: props.dish.coverUrl,
    skuId: sku.id,
    skuName: sku.name,
    unitPrice: sku.price,
    addons: selectedAddons.value.map((a) => ({
      id: a.id,
      name: a.name,
      extraPrice: a.extraPrice || 0,
      groupName: a.groupName,
    })),
    remark: remark.value,
    quantity: quantity.value,
  });

  emit('confirm');
  uni.showToast({ title: '已加入', icon: 'none', duration: 1000 });
}

function handleClose() {
  emit('close');
}
</script>

<style lang="scss" scoped>
.addon-modal {
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  flex-shrink: 0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $dark-3;
}

.modal-close {
  font-size: 36rpx;
  color: $dark-9;
  padding: 8rpx;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

.option-section {
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.option-title {
  font-size: 26rpx;
  font-weight: bold;
  color: $dark-3;
  margin-bottom: 16rpx;
  display: block;
}

.required-tag {
  font-size: 18rpx;
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

.price-extra {
  font-size: 22rpx;
  color: $red;
  margin-left: 4rpx;
}

.remark-input {
  width: 100%;
  height: 60rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.qty-row {
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

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
  flex-shrink: 0;
}

.footer-price {
  font-size: 36rpx;
  font-weight: bold;
  color: $red;
}

.footer-btn {
  padding: 16rpx 48rpx;
  background: $red;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;

  &.disabled {
    background: #ccc;
  }
}
</style>
