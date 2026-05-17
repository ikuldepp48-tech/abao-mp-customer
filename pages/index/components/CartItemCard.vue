<template>
  <view class="cart-item-card" :class="{ 'is-invalid': isInvalid }">
    <!-- 复选框 -->
    <view class="cart-item-check" @click="$emit('select')" v-if="!editMode">
      <view class="check-circle" :class="{ checked: selected }">
        <text v-if="selected" class="check-mark">✓</text>
      </view>
    </view>

    <!-- 商品图片 -->
    <su-image
      :src="item.spu?.picUrl || item.goods?.image || '/static/logo.png'"
      :width="140"
      :height="140"
      borderRadius="12rpx"
    />

    <!-- 商品信息 -->
    <view class="cart-item-body">
      <text class="cart-item-name">{{ item.spu?.name || item.goods?.title || '' }}</text>
      <text class="cart-item-sku" v-if="skuText">{{ skuText }}</text>
      <view class="cart-item-bottom">
        <text class="cart-item-price">¥{{ (item.sku?.price || 0).toFixed(2) }}</text>
        <!-- 数量控制 -->
        <view class="qty-ctrl" v-if="!editMode">
          <view class="qty-btn" @click="$emit('decrease')">−</view>
          <text class="qty-num">{{ item.count }}</text>
          <view class="qty-btn" @click="$emit('increase')">+</view>
        </view>
      </view>
    </view>

    <!-- 下架/无库存遮罩 -->
    <view v-if="isInvalid" class="invalid-overlay">
      <text class="invalid-text">{{ invalidText }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  editMode: { type: Boolean, default: false },
});

defineEmits(['select', 'increase', 'decrease']);

const skuText = computed(() => {
  const props2 = props.item.sku?.properties;
  if (!props2 || !props2.length) return '';
  if (props2.length > 1) {
    return props2.map(p => p.valueName).join(' ');
  }
  return props2[0]?.valueName || '';
});

const isInvalid = computed(() => {
  if (props.editMode) return false;
  return props.item.spu?.status !== 1 || props.item.spu?.stock <= 0;
});

const invalidText = computed(() => {
  if (props.item.spu?.status !== 1) return '该商品已下架';
  if (props.item.spu?.stock <= 0) return '该商品无库存';
  return '';
});
</script>

<style lang="scss" scoped>
.cart-item-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: var(--bg);
  border-radius: var(--r-md);
  position: relative;

  &.is-invalid {
    opacity: 0.5;
  }
}

.cart-item-check {
  flex-shrink: 0;
}

.check-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid var(--ink-300);
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background: var(--abao-red);
    border-color: var(--abao-red);
  }
}

.check-mark {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

.cart-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.cart-item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-sku {
  font-size: 22rpx;
  color: var(--ink-500);
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rpx;
}

.cart-item-price {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.qty-ctrl {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.qty-btn {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 1px solid var(--ink-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--ink-700);
}

.qty-num {
  font-size: 28rpx;
  min-width: 36rpx;
  text-align: center;
  color: var(--ink-900);
}

.invalid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.invalid-text {
  font-size: 28rpx;
  color: var(--ink-400);
  font-weight: 600;
}
</style>
