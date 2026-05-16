<template>
  <view class="abao-ph" :class="`abao-ph--${size}`">
    <text class="abao-ph__watermark">Placeholder</text>
    <text v-if="text" class="abao-ph__text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<style lang="scss" scoped>
.abao-ph {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: var(--r-md);
  overflow: hidden;

  /* 45deg 斜条纹背景 */
  background: repeating-linear-gradient(
    45deg,
    var(--ink-100) 0px,
    var(--ink-100) 8px,
    var(--ink-200) 8px,
    var(--ink-200) 16px
  );

  /* 模拟对角线方向 */
  background: repeating-linear-gradient(
    -45deg,
    var(--ink-100),
    var(--ink-100) 6px,
    var(--ink-200) 6px,
    var(--ink-200) 12px
  );
}

/* 水印 — 高对比度深色 */
.abao-ph__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-20deg);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(0, 0, 0, 0.18);
  text-transform: uppercase;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.abao-ph__text {
  position: relative;
  z-index: 2;
  font-family: var(--font-mono);
  color: var(--ink-500);
  text-align: center;
}

/* sizes */
.abao-ph--sm {
  min-height: 40px;
  padding: 8px 12px;
}
.abao-ph--sm .abao-ph__text { font-size: 12px; }
.abao-ph--sm .abao-ph__watermark { font-size: 8px; letter-spacing: 2px; }

.abao-ph--md {
  min-height: 64px;
  padding: 16px 20px;
}
.abao-ph--md .abao-ph__text { font-size: 14px; }
.abao-ph--md .abao-ph__watermark { font-size: 10px; }

.abao-ph--lg {
  min-height: 96px;
  padding: 24px 32px;
}
.abao-ph--lg .abao-ph__text { font-size: 16px; }
.abao-ph--lg .abao-ph__watermark { font-size: 12px; letter-spacing: 4px; }
</style>
