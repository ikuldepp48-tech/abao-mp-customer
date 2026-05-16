<template>
  <view
    class="abao-capsule"
    :class="[`abao-capsule--${variant}`, `abao-capsule--${size}`]"
    @touchstart="pressed = true"
    @touchend="pressed = false"
    @touchcancel="pressed = false"
  >
    <text class="abao-capsule__text">{{ text }}</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  text: { type: String, default: '' },
  variant: { type: String, default: 'filled' }, // filled | outline | ghost
  size: { type: String, default: 'md' },        // sm | md | lg
})

const pressed = ref(false)
</script>

<style lang="scss" scoped>
.abao-capsule {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
/* 点击 scale 反馈 */
.abao-capsule:active {
  transform: scale(0.95);
}

/* variant: filled — 实心红 + 品牌红阴影 */
.abao-capsule--filled {
  background: var(--abao-red);
  color: #fff;
  box-shadow: var(--shadow-red);
}
.abao-capsule--filled:active {
  background: var(--abao-red-deep);
}

/* variant: outline — 红描边透明底 */
.abao-capsule--outline {
  background: transparent;
  border: 1.5px solid var(--abao-red);
  color: var(--abao-red);
  box-shadow: 0 2px 8px rgba(219,44,43,.12);
}
.abao-capsule--outline:active {
  background: var(--abao-red-soft);
}

/* variant: ghost — 浅红底无描边 */
.abao-capsule--ghost {
  background: var(--abao-red-soft);
  color: var(--abao-red-deep);
}
.abao-capsule--ghost:active {
  background: var(--ink-200);
}

.abao-capsule__text {
  font-family: var(--font-body);
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  border: 0;
}

/* sizes */
.abao-capsule--sm {
  padding: 3px 10px;
  font-size: 11px;
}
.abao-capsule--md {
  padding: 6px 16px;
  font-size: 13px;
}
.abao-capsule--lg {
  padding: 9px 24px;
  font-size: 15px;
}
</style>
