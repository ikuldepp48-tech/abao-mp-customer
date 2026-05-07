<template>
  <view class="dish-card" :class="{ 'is-sold-out': dish.isSoldOut }" @click="handleClick">
    <su-image
      :src="dish.coverUrl || '/static/logo.png'"
      :width="160"
      :height="160"
      borderRadius="12rpx"
    />
    <view class="dish-info">
      <view class="dish-title-row">
        <text class="dish-name">{{ dish.name }}</text>
        <text class="dish-tag tag-new" v-if="dish.isNew">新品</text>
        <text class="dish-tag tag-sold" v-if="dish.isSoldOut">沽清</text>
      </view>
      <text class="dish-desc" v-if="dish.subtitle">{{ dish.subtitle }}</text>
      <view class="dish-price-row">
        <view class="dish-price-left">
          <text class="dish-price">¥{{ dish.minPrice }}</text>
        </view>
        <view v-if="dish.isSoldOut" class="dish-btn sold-out">已沽清</view>
        <view v-else-if="needSpec" class="dish-btn spec" @click.stop="$emit('add', dish)">选规格</view>
        <view v-else class="dish-btn add" @click.stop="$emit('add', dish)">+</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  dish: { type: Object, required: true },
});

defineEmits(['add']);

const needSpec = computed(() => {
  const d = props.dish;
  if (!d) return false;
  const hasMultiSku = d.skus && d.skus.length > 1;
  const hasAddons = d.addons && d.addons.length > 0;
  return hasMultiSku || hasAddons;
});

function handleClick() {
  uni.navigateTo({ url: '/pages/dish/detail?spuId=' + props.dish.spuId });
}
</script>

<style lang="scss" scoped>
.dish-card {
  display: flex;
  background: #fff;
  border-radius: var(--r-md);
  padding: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-sm);

  &.is-sold-out {
    opacity: 0.55;
  }
}

.dish-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.dish-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--ink-900);
}

.dish-tag {
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: var(--r-pill);
  line-height: 1.4;
  font-weight: 600;

  &.tag-new {
    color: var(--abao-red);
    background: var(--abao-red-soft);
  }

  &.tag-sold {
    color: var(--ink-500);
    background: var(--ink-100);
  }
}

.dish-desc {
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 4rpx;
}

.dish-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-price {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--abao-red);
  font-family: var(--font-num);
}

.dish-btn {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: var(--r-pill);
  text-align: center;
  font-weight: 600;

  &.add {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: var(--abao-red);
    color: #fff;
    font-size: 32rpx;
    line-height: 48rpx;
    padding: 0;
    box-shadow: var(--shadow-red);
  }

  &.spec {
    background: var(--abao-red);
    color: #fff;
    border-radius: var(--r-pill);
  }

  &.sold-out {
    background: var(--ink-200);
    color: var(--ink-500);
    border-radius: var(--r-pill);
  }
}
</style>
