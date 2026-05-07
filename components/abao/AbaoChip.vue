<template>
  <view class="abao-chip" :class="`abao-chip--${variant}`">
    <text>{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
  variant: { type: String, default: 'red' }, // red | yellow | outline
})
</script>

<style lang="scss" scoped>
.abao-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
}
.abao-chip--red {
  background: var(--abao-red-soft);
  color: var(--abao-red-deep);
}
.abao-chip--yellow {
  background: var(--abao-yellow-soft);
  color: var(--abao-red-deep);
}
.abao-chip--outline {
  background: #fff;
  border: 1px solid var(--ink-200);
  color: var(--ink-700);
}
</style>
