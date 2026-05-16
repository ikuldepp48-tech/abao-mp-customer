<template>
  <view
    class="abao-stat-card"
    :class="{ 'abao-stat-card--clickable': clickable }"
    @click="onClick"
  >
    <text class="abao-stat-card__label">{{ label }}</text>

    <view class="abao-stat-card__value-row">
      <text class="abao-stat-card__value">{{ displayValue }}</text>
      <text v-if="unit" class="abao-stat-card__unit">{{ unit }}</text>
    </view>

    <view v-if="trend" class="abao-stat-card__trend" :class="`abao-stat-card__trend--${trend}`">
      <text class="abao-stat-card__trend-icon">{{ trendIcon }}</text>
      <text v-if="trendValue" class="abao-stat-card__trend-value">{{ trendValue }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value:      { type: [String, Number], required: true },
  label:      { type: String, required: true },
  unit:       { type: String, default: '' },
  trend:      { type: String, default: '' },  // up | down | flat
  trendValue: { type: String, default: '' },
  clickable:  { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
function onClick() { if (props.clickable) emit('click') }

const displayValue = computed(() => {
  const v = props.value
  if (typeof v === 'number') return v.toLocaleString()
  return v
})

const trendIcon = computed(() => {
  if (props.trend === 'up')   return '↑'
  if (props.trend === 'down') return '↓'
  return '→'
})
</script>

<style lang="scss" scoped>
.abao-stat-card {
  background: #fff;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 28rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.abao-stat-card--clickable {
  cursor: pointer;
}
.abao-stat-card--clickable:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.abao-stat-card__label {
  font-family: var(--font-body);
  font-size: 24rpx;
  font-weight: 400;
  color: var(--ink-500);
}

.abao-stat-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.abao-stat-card__value {
  font-family: var(--font-num);
  font-size: 48rpx;
  font-weight: 800;
  color: var(--ink-900);
  line-height: 1;
}

.abao-stat-card__unit {
  font-family: var(--font-body);
  font-size: 24rpx;
  font-weight: 600;
  color: var(--ink-500);
}

.abao-stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.abao-stat-card__trend-icon {
  font-size: 22rpx;
  font-weight: 700;
}

.abao-stat-card__trend-value {
  font-family: var(--font-mono);
  font-size: 22rpx;
  font-weight: 600;
}

.abao-stat-card__trend--up .abao-stat-card__trend-icon,
.abao-stat-card__trend--up .abao-stat-card__trend-value {
  color: var(--accent-mint);
}

.abao-stat-card__trend--down .abao-stat-card__trend-icon,
.abao-stat-card__trend--down .abao-stat-card__trend-value {
  color: var(--abao-red);
}

.abao-stat-card__trend--flat .abao-stat-card__trend-icon,
.abao-stat-card__trend--flat .abao-stat-card__trend-value {
  color: var(--ink-300);
}
</style>
