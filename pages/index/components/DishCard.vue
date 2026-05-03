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
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;

  &.is-sold-out {
    opacity: 0.6;
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
  font-weight: bold;
  color: $dark-3;
}

.dish-tag {
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  line-height: 1.4;

  &.tag-new {
    color: $red;
    border: 1rpx solid $red;
  }

  &.tag-sold {
    color: $dark-9;
    border: 1rpx solid $dark-9;
  }
}

.dish-desc {
  font-size: 22rpx;
  color: $dark-9;
  margin-top: 4rpx;
}

.dish-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dish-price {
  font-size: 30rpx;
  font-weight: bold;
  color: $red;
}

.dish-btn {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  text-align: center;

  &.add {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: $red;
    color: #fff;
    font-size: 32rpx;
    line-height: 48rpx;
    padding: 0;
  }

  &.spec {
    background: $red;
    color: #fff;
  }

  &.sold-out {
    background: #ccc;
    color: #fff;
  }
}
</style>
