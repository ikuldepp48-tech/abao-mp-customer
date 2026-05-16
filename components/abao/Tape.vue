<template>
  <view class="abao-tape" :class="`abao-tape--${variant}`">
    <view class="abao-tape__hole abao-tape__hole--left" />
    <text class="abao-tape__text">{{ text }}</text>
    <view class="abao-tape__hole abao-tape__hole--right" />
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
  variant: { type: String, default: 'red' }, // red | yellow | dark
})
</script>

<style lang="scss" scoped>
.abao-tape {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 20px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-red);
  transform: rotate(-3deg);
  transform-origin: center center;
}

/* 边缘小孔 — 穿孔撕裂效果 */
.abao-tape__hole {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bg);
  transform: translateY(-50%);
  z-index: 1;
}
.abao-tape__hole--left  { left: -5px; }
.abao-tape__hole--right { right: -5px; }

/* variant: red */
.abao-tape--red {
  background: var(--abao-red);
  color: #fff;
}

/* variant: yellow */
.abao-tape--yellow {
  background: var(--abao-yellow);
  color: var(--ink-900);
}

/* variant: dark */
.abao-tape--dark {
  background: var(--ink-900);
  color: var(--abao-yellow);
}

.abao-tape__text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  line-height: 1.4;
  white-space: nowrap;
}
</style>
