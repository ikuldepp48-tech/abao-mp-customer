<template>
  <view
    class="abao-card"
    :class="[`abao-card--${variant}`, { 'abao-card--clickable': clickable }]"
    @click="onClick"
  >
    <view v-if="$slots.header" class="abao-card__header">
      <slot name="header" />
    </view>
    <view class="abao-card__body">
      <slot />
    </view>
    <view v-if="$slots.footer" class="abao-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' }, // default | accent | minimal
  clickable: { type: Boolean, default: false },
})
const emit = defineEmits(['click'])
function onClick() { emit('click') }
</script>

<style lang="scss" scoped>
.abao-card {
  background: #fff;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* variant: accent — 左侧红边强调 */
.abao-card--accent {
  border-left: 4px solid var(--abao-red);
}

/* variant: minimal — 无阴影 + 浅底 + 细边框 */
.abao-card--minimal {
  background: var(--ink-100);
  box-shadow: none;
  border: 1px solid var(--ink-200);
}

/* clickable 交互反馈 */
.abao-card--clickable {
  cursor: pointer;
}
.abao-card--clickable:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.abao-card__header {
  padding: 24rpx 24rpx 0;
}
.abao-card__body {
  padding: 24rpx;
}
.abao-card__footer {
  padding: 0 24rpx 24rpx;
}
</style>
