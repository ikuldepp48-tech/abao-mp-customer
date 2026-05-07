<template>
  <view class="stores-page">
    <AbaoNavBar title="选择门店" :showBack="true" />

    <!-- 地图占位区 -->
    <view class="stores-map">
      <view class="stores-map-pin" v-for="(pos, i) in mapPins" :key="i"
        :style="{ left: pos[0] + '%', top: pos[1] + '%' }">
        <view class="stores-map-pin-icon" :class="{ active: i === 0 }">
          <text class="stores-map-pin-text">堡</text>
        </view>
      </view>
      <view class="stores-map-locate">📍 我的位置</view>
    </view>

    <!-- 筛选 Tab -->
    <view class="stores-tabs">
      <view
        v-for="tab in filterTabs"
        :key="tab.name"
        class="stores-tab"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 门店列表 -->
    <scroll-view class="stores-scroll" scroll-y>
      <AbaoCard v-for="(store, i) in filteredStores" :key="i" class="store-card">
        <view class="store-card-header">
          <text class="store-name">{{ store.name }}</text>
          <text class="store-distance">直线 {{ store.distance }}</text>
        </view>
        <text class="store-queue">📦 {{ store.queue }}</text>
        <text class="store-address">{{ store.address }}</text>
        <text class="store-time">⏰ {{ store.hours }}</text>
        <view class="store-card-footer">
          <AbaoChip text="可外卖" variant="red" />
          <AbaoChip text="接受预定" variant="yellow" />
          <view class="store-actions">
            <button class="store-btn store-btn--call">📞</button>
            <button class="store-btn store-btn--enter" @click="selectStore(store)">➤</button>
          </view>
        </view>
      </AbaoCard>
      <view class="bottom-placeholder" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';
import AbaoChip from '@/components/abao/AbaoChip.vue';

const activeTab = ref('nearby');

const filterTabs = [
  { name: 'nearby', label: '附近' },
  { name: 'fav', label: '收藏' },
  { name: 'history', label: '历史' },
];

const mapPins = [
  [40, 38],
  [68, 52],
  [28, 72],
  [80, 30],
];

const stores = ref([
  {
    name: '天河北路阿堡店',
    address: '广东广州天河区天河北路168号',
    distance: '164m',
    queue: '前方12杯制作中',
    hours: '09:00-22:30',
  },
  {
    name: '五山地铁站店',
    address: '广东广州天河区五山路268号A-08',
    distance: '1.08km',
    queue: '前方6杯制作中',
    hours: '09:00-22:00',
  },
  {
    name: '珠江新城店',
    address: '广东广州天河区珠江东路24号花城汇L1-09',
    distance: '2.02km',
    queue: '前方31杯制作中',
    hours: '09:00-22:30',
  },
]);

const filteredStores = computed(() => stores.value);

function selectStore(store) {
  uni.showToast({ title: '已选择：' + store.name, icon: 'none' });
  uni.navigateBack({ delta: 1 });
}
</script>

<style lang="scss" scoped>
.stores-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

/* 地图区 */
.stores-map {
  height: 360rpx;
  background:
    repeating-linear-gradient(45deg, #EFEDE3 0 18rpx, #E8E6DC 18rpx 36rpx),
    linear-gradient(180deg, #E8EEEC 0%, #DFE7D9 100%);
  position: relative;
  border-bottom: 1px solid var(--ink-200);
  flex-shrink: 0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background: radial-gradient(circle at 30% 60%, rgba(140, 180, 170, 0.5), transparent 30%);
    pointer-events: none;
  }
}

.stores-map-pin {
  position: absolute;
  transform: translate(-50%, -100%);
}

.stores-map-pin-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50% 50% 50% 0;
  background: rgba(180, 40, 30, 0.5);
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: var(--abao-red);
    box-shadow: var(--shadow-md);
  }
}

.stores-map-pin-text {
  transform: rotate(45deg);
  color: #fff;
  font-weight: 700;
  font-size: 28rpx;
  font-family: var(--font-display);
}

.stores-map-locate {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  padding: 12rpx 20rpx;
  background: #fff;
  border-radius: var(--r-pill);
  font-size: 22rpx;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  color: var(--ink-700);
}

/* 筛选 Tab */
.stores-tabs {
  display: flex;
  padding: 20rpx 28rpx;
  gap: 16rpx;
  flex-shrink: 0;
}

.stores-tab {
  padding: 12rpx 28rpx;
  border-radius: var(--r-pill);
  font-size: 24rpx;
  font-weight: 600;
  background: #fff;
  border: 1px solid var(--ink-200);
  color: var(--ink-700);

  &.active {
    background: var(--abao-red);
    color: #fff;
    border-color: var(--abao-red);
  }
}

/* 门店列表 */
.stores-scroll {
  flex: 1;
  padding: 0 24rpx;
}

.store-card {
  margin-bottom: 20rpx;
  padding: 28rpx;
}

.store-card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.store-name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--ink-900);
}

.store-distance {
  font-size: 22rpx;
  color: var(--ink-500);
  font-family: var(--font-num);
}

.store-queue {
  font-size: 22rpx;
  color: var(--abao-red);
  margin-top: 8rpx;
  display: block;
}

.store-address {
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 12rpx;
  line-height: 1.5;
  display: block;
}

.store-time {
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 8rpx;
  display: block;
}

.store-card-footer {
  display: flex;
  gap: 12rpx;
  margin-top: 20rpx;
  align-items: center;
}

.store-actions {
  margin-left: auto;
  display: flex;
  gap: 16rpx;
}

.store-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  border: none;
  padding: 0;

  &--call {
    border: 1px solid var(--ink-200);
    background: #fff;
  }

  &--enter {
    background: var(--abao-red);
    color: #fff;
    box-shadow: var(--shadow-red);
  }
}

.bottom-placeholder {
  height: 40rpx;
}
</style>
