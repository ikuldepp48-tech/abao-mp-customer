<template>
  <view class="abao-skeleton" :class="`abao-skeleton--${variant}`">
    <view
      class="abao-skeleton__bone"
      :class="boneClass(n)"
      v-for="n in count"
      :key="n"
    />
  </view>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'list' }, // list | card | detail
  count:   { type: Number, default: 3 },
})

function boneClass(n) {
  return `abao-skeleton__bone--${n}`
}
</script>

<style lang="scss" scoped>
.abao-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx;
}

.abao-skeleton__bone {
  height: 28rpx;
  border-radius: var(--r-sm);
  background: linear-gradient(
    90deg,
    var(--ink-100) 0%,
    var(--ink-200) 40%,
    var(--ink-100) 80%
  );
  background-size: 200% 100%;
  animation: abao-shimmer-sweep 1.6s ease-in-out infinite;
}

/* list: 交替宽度模拟真实列表 */
.abao-skeleton--list .abao-skeleton__bone--2 { width: 85%; }
.abao-skeleton--list .abao-skeleton__bone--3 { width: 60%; }

/* card: 较大矩形块 */
.abao-skeleton--card .abao-skeleton__bone {
  height: 200rpx;
  border-radius: var(--r-md);
}
.abao-skeleton--card .abao-skeleton__bone--2 { height: 28rpx; margin-top: 4rpx; }
.abao-skeleton--card .abao-skeleton__bone--3 { height: 28rpx; width: 60%; }

/* detail: 首块大图 + 文字行 */
.abao-skeleton--detail .abao-skeleton__bone {
  height: 26rpx;
}
.abao-skeleton--detail .abao-skeleton__bone--1 {
  height: 320rpx;
  border-radius: var(--r-md);
}
.abao-skeleton--detail .abao-skeleton__bone--2 { width: 70%; }
.abao-skeleton--detail .abao-skeleton__bone--3 { width: 45%; }

/* shimmer: 高光从左到右扫过 */
@keyframes abao-shimmer-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
