<template>
  <view class="abao-page-header" :class="`abao-page-header--${align}`">
    <view class="abao-page-header__row">
      <view class="abao-page-header__titles">
        <view v-if="showTape" class="abao-page-header__tape">
          <Tape text="" variant="yellow" />
        </view>
        <text class="abao-page-header__title">{{ title }}</text>
        <text v-if="subtitle" class="abao-page-header__subtitle">{{ subtitle }}</text>
      </view>
      <view v-if="$slots.actions" class="abao-page-header__actions">
        <slot name="actions" />
      </view>
    </view>

    <view v-if="showSeal" class="abao-page-header__seal">
      <AbaoSeal text="堡" />
    </view>

    <view v-if="$slots.default" class="abao-page-header__extra">
      <slot />
    </view>
  </view>
</template>

<script setup>
import Tape from '@/components/abao/Tape.vue'
import AbaoSeal from '@/components/abao/AbaoSeal.vue'

defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  showSeal: { type: Boolean, default: false },
  showTape: { type: Boolean, default: false },
  align:    { type: String, default: 'left' }, // left | center
})
</script>

<style lang="scss" scoped>
.abao-page-header {
  padding: 32rpx 24rpx 24rpx;
}

.abao-page-header--center {
  text-align: center;
}
.abao-page-header--center .abao-page-header__row {
  justify-content: center;
}
.abao-page-header--center .abao-page-header__actions {
  position: absolute;
  right: 24rpx;
}

.abao-page-header__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}

.abao-page-header__titles {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.abao-page-header__tape {
  margin-bottom: 8rpx;
}

.abao-page-header__title {
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 800;
  color: var(--ink-900);
  line-height: 1.1;
  letter-spacing: -1px;
}

.abao-page-header__subtitle {
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-500);
  margin-top: 4rpx;
}

.abao-page-header__actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.abao-page-header__seal {
  margin-top: 8rpx;
}

.abao-page-header__extra {
  margin-top: 16rpx;
}
</style>
