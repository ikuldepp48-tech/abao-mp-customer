<template>
  <view class="abao-card">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.abao-card {
  background: #fff;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 16px;
}
</style>
