<template>
  <view class="abao-logo" :class="`abao-logo--${size}`">
    <text class="abao-logo__text">阿堡</text>
  </view>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<style lang="scss" scoped>
.abao-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--abao-red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 2px #fff inset, 0 0 0 3px var(--abao-red) inset;
  text-align: center;
}
/* size * 0.42 = fontSize per design formula */
.abao-logo--sm {
  width: 32px;
  height: 32px;
  font-size: 13px;
}
.abao-logo--md {
  width: 44px;
  height: 44px;
  font-size: 18px;
}
.abao-logo--lg {
  width: 60px;
  height: 60px;
  font-size: 25px;
}
.abao-logo__text {
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  text-align: center;
  line-height: 1;
}
</style>
