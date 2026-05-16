<template>
  <view class="abao-search-bar" :class="{ 'abao-search-bar--focused': isFocused }">
    <text class="abao-search-bar__icon">🔍</text>
    <input
      class="abao-search-bar__input"
      :value="modelValue"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />
    <text
      v-if="showClear && modelValue"
      class="abao-search-bar__clear"
      @click.stop="onClear"
    >✕</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: '搜索' },
  showClear:   { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear', 'focus', 'blur'])

const isFocused = ref(false)
const placeholderStyle = 'color: var(--ink-300); font-family: var(--font-body);'

function onInput(e) {
  emit('update:modelValue', e.detail.value)
}
function onFocus(e) {
  isFocused.value = true
  emit('focus', e)
}
function onBlur(e) {
  isFocused.value = false
  emit('blur', e)
}
function onConfirm(e) {
  emit('search', e.detail.value)
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style lang="scss" scoped>
.abao-search-bar {
  display: flex;
  align-items: center;
  background: var(--ink-100);
  border-radius: var(--r-pill);
  padding: 12rpx 24rpx;
  border: 1.5px solid transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.abao-search-bar--focused {
  border-color: var(--abao-red);
  box-shadow: 0 2px 8px rgba(219, 44, 43, 0.10);
  background: #fff;
}

.abao-search-bar__icon {
  font-size: 28rpx;
  opacity: 0.4;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.abao-search-bar__input {
  flex: 1;
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-900);
  background: transparent;
  min-height: 36rpx;
}

.abao-search-bar__clear {
  font-size: 28rpx;
  color: var(--ink-500);
  padding: 4rpx 8rpx;
  margin-left: 8rpx;
  flex-shrink: 0;
}
</style>
