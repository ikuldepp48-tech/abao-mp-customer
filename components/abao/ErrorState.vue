<template>
  <view class="abao-error">
    <text class="abao-error__icon">{{ displayIcon }}</text>
    <text class="abao-error__title">{{ displayTitle }}</text>
    <text v-if="displayDesc" class="abao-error__desc">{{ displayDesc }}</text>
    <view v-if="retryText" class="abao-error__retry" @click="onRetry">
      <Capsule :text="retryText" variant="outline" size="md" />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import Capsule from '@/components/abao/Capsule.vue'

const props = defineProps({
  errorType:   { type: String, default: 'network' }, // network | server | permission
  icon:        { type: String, default: '' },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  retryText:   { type: String, default: '重新加载' },
})

const emit = defineEmits(['retry'])
function onRetry() { emit('retry') }

const presets = {
  network:    { icon: '📡', title: '网络连接失败', desc: '请检查网络设置后重试' },
  server:     { icon: '🔧', title: '服务暂不可用', desc: '正在努力修复中，请稍后再试' },
  permission: { icon: '🔒', title: '暂无访问权限', desc: '请联系管理员开通权限' },
}

const preset = computed(() => presets[props.errorType] || presets.network)
const displayIcon  = computed(() => props.icon || preset.value.icon)
const displayTitle = computed(() => props.title || preset.value.title)
const displayDesc  = computed(() => props.description || preset.value.desc)
</script>

<style lang="scss" scoped>
.abao-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx 32rpx;
  gap: 12rpx;
}
.abao-error__icon {
  font-size: 64rpx;
  opacity: 0.8;
  margin-bottom: 8rpx;
}
.abao-error__title {
  font-family: var(--font-display);
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink-700);
}
.abao-error__desc {
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-500);
  text-align: center;
  max-width: 400rpx;
  line-height: 1.5;
}
.abao-error__retry {
  margin-top: 16rpx;
}
</style>
