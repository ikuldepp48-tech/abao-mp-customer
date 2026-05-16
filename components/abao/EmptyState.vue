<template>
  <view class="abao-empty">
    <text class="abao-empty__icon">{{ displayIcon }}</text>
    <text class="abao-empty__title">{{ displayTitle }}</text>
    <text v-if="displayDesc" class="abao-empty__desc">{{ displayDesc }}</text>
    <slot name="action" />
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  scenario: { type: String, default: 'customer' }, // customer | employee | boss | consultant
  icon:    { type: String, default: '' },
  title:   { type: String, default: '' },
  description: { type: String, default: '' },
})

const presets = {
  customer:   { icon: '🍽️', title: '还没有点餐记录', desc: '逛逛菜单选一份吧' },
  employee:   { icon: '📋', title: '暂无订单', desc: '当前没有待处理的订单' },
  boss:       { icon: '📊', title: '数据还在路上', desc: '经营数据稍后就到，请耐心等待' },
  consultant: { icon: '🔍', title: '该客户暂无数据', desc: '先看看其他客户的经营情况' },
}

const preset = computed(() => presets[props.scenario] || presets.customer)
const displayIcon  = computed(() => props.icon || preset.value.icon)
const displayTitle = computed(() => props.title || preset.value.title)
const displayDesc  = computed(() => props.description || preset.value.desc)
</script>

<style lang="scss" scoped>
.abao-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx 32rpx;
  gap: 12rpx;
}
.abao-empty__icon {
  font-size: 64rpx;
  opacity: 0.7;
  margin-bottom: 8rpx;
}
.abao-empty__title {
  font-family: var(--font-display);
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink-700);
}
.abao-empty__desc {
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-500);
  text-align: center;
  max-width: 400rpx;
  line-height: 1.5;
}
</style>
