<template>
  <view class="abao-seal">
    <text class="abao-seal__text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.abao-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--abao-red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1;
  position: relative;
  box-shadow: 0 0 0 2px #fff inset, 0 0 0 3px var(--abao-red) inset;
  text-align: center;
}
.abao-seal__text {
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  line-height: 1;
  text-align: center;
}
</style>
