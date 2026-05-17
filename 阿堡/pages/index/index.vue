<template>
  <view class="home-page">
    <view class="wx-scroll">
      <!-- ═══ [1] Hero 区（静态 — 立即渲染）═══ -->
      <HomeHero
        :storeName="storeName"
        :storeDistance="storeDistance"
        @click-store="goSelectStore"
      />

      <!-- ═══ [2] 浮起双卡片（静态 — 立即渲染）═══ -->
      <HomeFloatingCards
        @click-dinein="goOrder('dinein')"
        @click-delivery="goOrder('delivery')"
      />

      <!-- ═══ [3] 用户信息条（静态 — 立即渲染）═══ -->
      <HomeUserBar
        :isLoggedIn="isLoggedIn"
        :nickname="userNickname"
        :avatar="userAvatar"
        :level="userLevel"
        :points="userPoints"
        :couponCount="couponCount"
        :medalCount="medalCount"
        @click-login="goLogin"
      />

      <!-- ═══ [4] 快捷入口（静态 — 立即渲染）═══ -->
      <view class="home-quick-entries">
        <view
          v-for="e in quickEntries"
          :key="e.label"
          class="home-quick-entry"
          @click="onQuickEntry(e)"
        >
          <view class="home-quick-entry-icon">{{ e.icon }}</view>
          <text class="home-quick-entry-label">{{ e.label }}</text>
        </view>
      </view>

      <!-- ═══ [5] Banner（动态 — 骨架屏占位）═══ -->
      <view v-if="loadingState === 'idle' && banner" class="home-banner-wrap">
        <view class="home-banner" @click="goBannerTarget">
          <text v-if="isMockData" class="mock-badge">演示数据</text>
          <text class="home-banner-tag">{{ banner.tag }}</text>
          <text class="home-banner-title">{{ banner.title }}</text>
          <view class="home-banner-cta">
            <text class="home-banner-cta-text">{{ banner.cta }}</text>
          </view>
          <view class="home-banner-deco" />
          <text class="home-banner-emoji">🍔</text>
        </view>
      </view>
      <view v-else-if="loadingState === 'loading'" class="home-banner-wrap">
        <LoadingSkeleton variant="card" :count="1" />
      </view>

      <!-- ═══ [6] 今日招牌（动态 — 骨架屏占位）═══ -->
      <view v-if="loadingState === 'idle' && recommendedDishes.length" style="position:relative">
        <text v-if="isMockData" class="mock-badge mock-badge--section">演示数据</text>
        <HomeRecommend
          :dishes="recommendedDishes"
          @click-dish="goDishDetail"
          @quick-add="onQuickAdd"
          @click-more="goMoreRecommended"
        />
      </view>
      <view v-else-if="loadingState === 'loading'" style="padding: 0 28rpx;">
        <LoadingSkeleton variant="list" :count="2" />
      </view>

      <!-- ═══ [7] 堡内新闻（动态 — 骨架屏占位）═══ -->
      <view v-if="loadingState === 'idle' && newsList.length" class="home-news">
        <text class="home-news-title">堡内新闻</text>
        <text v-if="isMockData" class="mock-badge mock-badge--inline">演示数据</text>
        <view
          v-for="(n, i) in newsList"
          :key="i"
          class="home-news-item"
          @click="goNewsDetail(n)"
        >
          <Ph w="140rpx" h="140rpx" label="news" />
          <view class="home-news-item-body">
            <text class="home-news-item-title">{{ n.title }}</text>
            <text class="home-news-item-date">{{ n.date }} · {{ n.category }}</text>
          </view>
        </view>
      </view>
      <view v-else-if="loadingState === 'loading'" style="padding: 0 28rpx;">
        <LoadingSkeleton variant="list" :count="2" />
      </view>

      <!-- ═══ [8] 加载失败 — ErrorState ═══ -->
      <view v-if="loadingState === 'error'" class="home-error">
        <ErrorState
          :errorType="errorType"
          retryText="重新加载"
          @retry="retryLoad"
        />
      </view>

      <!-- 底部安全区占位（Tabbar 之上） -->
      <view class="home-bottom-placeholder" />
    </view>

    <!-- ═══ [9] Tabbar ═══ -->
    <AbaoTabBar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import sheep from '@/sheep'
import HomeHero from './components/HomeHero.vue'
import HomeFloatingCards from './components/HomeFloatingCards.vue'
import HomeUserBar from './components/HomeUserBar.vue'
import HomeRecommend from './components/HomeRecommend.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import AbaoTabBar from '@/components/AbaoTabBar.vue'
import Ph from '@/components/Ph.vue'

// ── 状态 ──
const loadingState = ref('loading') // loading | idle | error
const errorType = ref('network')
const isLoggedIn = ref(false)
const isMockData = ref(false)

// ── 静态数据（不依赖接口） ──
const storeName = ref('广州·天河北路阿堡店')
const storeDistance = ref(168)
const userNickname = ref('小堡同学')
const userAvatar = ref('')
const userLevel = ref(2)
const userPoints = ref(1280)
const couponCount = ref(6)
const medalCount = ref(3)

// ── 快捷入口（静态配置） ──
const quickEntries = [
  { icon: '🎫', label: '优惠券', path: '/pages/index/coupons' },
  { icon: '🎁', label: '礼品卡', path: '/pages/index/giftcard' },
  { icon: '🎯', label: '抽大奖', path: '/pages/index/lottery' },
  { icon: '🎓', label: '学生礼', path: '/pages/index/student' },
]

// ── 动态数据（依赖接口） ──
const banner = ref(null)
const recommendedDishes = ref([])
const newsList = ref([])

// ── Mock 降级数据 ──
function getMockData() {
  return {
    banner: {
      tag: 'NEW · 0506',
      title: '双层和牛芝士堡\n限时 · 第二个半价',
      cta: '立即尝鲜 →',
      targetUrl: '/pages/dish/detail?id=1',
    },
    dishes: [
      { id: 1, name: '经典芝士牛肉堡', tag: '招牌', price: 32, bgColor: '#E8864B', emoji: '🍔' },
      { id: 2, name: '双层和牛芝士堡', tag: 'NEW', price: 48, bgColor: '#F5D58B', emoji: '🍔' },
      { id: 3, name: '香辣鸡腿堡', tag: 'HOT', price: 26, bgColor: '#E88B7C', emoji: '🍔' },
    ],
    news: [
      { id: 1, title: '夏日和牛系列 · 五月限定上线', date: '05.05', category: '品牌' },
      { id: 2, title: '会员日 · 周三薯条免费续', date: '05.04', category: '活动' },
    ],
  }
}

// ── 数据加载 ──
async function loadHomeData() {
  loadingState.value = 'loading'
  try {
    // 静态区已渲染（Hero/浮起卡片/用户条/快捷入口不等待接口）
    const token = uni.getStorageSync('token')
    isLoggedIn.value = !!token

    // 并行请求动态数据
    const mock = getMockData()
    let bannerData = null
    let dishData = []
    let newsData = []

    try {
      const res = await Promise.all([
        sheep.$api?.restaurant?.getActiveBanner?.() || Promise.resolve(null),
        sheep.$api?.restaurant?.getRecommendedDishes?.(3) || Promise.resolve(null),
        sheep.$api?.content?.getNews?.(2) || Promise.resolve(null),
      ])
      bannerData = res[0]
      dishData = res[1]
      newsData = res[2]
    } catch {
      // 接口不可用 → 降级 mock
    }

    banner.value = bannerData || mock.banner
    recommendedDishes.value = (dishData && dishData.length) ? dishData : mock.dishes
    newsList.value = (newsData && newsData.length) ? newsData : mock.news

    // 标记是否使用了 mock 数据（接口未就绪时）
    isMockData.value = !bannerData || !(dishData && dishData.length) || !(newsData && newsData.length)

    loadingState.value = 'idle'
  } catch {
    loadingState.value = 'error'
    errorType.value = 'network'
  }
}

function retryLoad() {
  loadHomeData()
}

// ── 交互 ──
function goSelectStore() {
  uni.navigateTo({ url: '/pages/index/stores' })
}

function goOrder(mode) {
  // 切换到点单页，传递模式参数
  uni.switchTab({ url: '/pages/index/order' })
  // mode(dinein/delivery)通过 store 传递
  if (mode) {
    uni.setStorageSync('orderMode', mode)
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages/index/login' })
}

function onQuickEntry(e) {
  uni.showToast({ title: e.label + ' 即将上线', icon: 'none', duration: 1500 })
}

function goBannerTarget() {
  if (banner.value?.targetUrl) {
    uni.navigateTo({ url: banner.value.targetUrl })
  }
}

function goDishDetail(dish) {
  uni.navigateTo({ url: `/pages/dish/detail?id=${dish.id}` })
}

function onQuickAdd(dish) {
  // 简化加购：直接往购物车 store 加一项
  try {
    const cartStore = sheep.$store?.('cart')
    if (cartStore) {
      cartStore.addItem({
        spuId: dish.id,
        spuName: dish.name,
        coverUrl: '',
        skuId: 0,
        skuName: '',
        unitPrice: dish.price,
        addons: [],
        remark: '',
        quantity: 1,
      })
      uni.showToast({ title: '已加入购物车', icon: 'none', duration: 1000 })
    }
  } catch {
    // cart store 不可用时静默
  }
}

function goMoreRecommended() {
  uni.navigateTo({ url: '/pages/index/recommended' })
}

function goNewsDetail(n) {
  uni.navigateTo({ url: `/pages/public/article?id=${n.id}` })
}

onLoad(() => {
  loadHomeData()
})
</script>

<style lang="scss" scoped>
/* ── Mock 数据标记 ── */
.mock-badge {
  position: absolute;
  top: 8rpx;
  right: 12rpx;
  z-index: 10;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.25);
  padding: 4rpx 14rpx;
  border-radius: 999px;
  letter-spacing: 2px;
}
.mock-badge--section {
  top: 8rpx;
  right: 28rpx;
}
.mock-badge--inline {
  position: static;
  display: inline-block;
  margin-left: 12rpx;
  vertical-align: middle;
  color: var(--ink-500);
  background: var(--ink-100);
}

.home-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* ── [4] 快捷入口 ── */
.home-quick-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 8rpx 28rpx 36rpx;
}
.home-quick-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 8rpx;
}
.home-quick-entry-icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background: var(--abao-yellow-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.home-quick-entry-label {
  font-size: 22rpx;
  color: var(--ink-700);
}

/* ── [5] Banner ── */
.home-banner-wrap {
  padding: 0 28rpx;
}
.home-banner {
  background: linear-gradient(110deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
  border-radius: var(--r-lg);
  padding: 36rpx 32rpx;
  min-height: 216rpx;
  position: relative;
  overflow: hidden;
}
.home-banner-tag {
  font-family: var(--font-mono);
  font-size: 18rpx;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
}
.home-banner-title {
  display: block;
  font-family: var(--font-display);
  font-size: 48rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 28rpx;
  line-height: 1.1;
  white-space: pre-line;
}
.home-banner-cta {
  margin-top: 20rpx;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background: var(--abao-yellow);
  padding: 10rpx 24rpx;
  border-radius: 999px;
}
.home-banner-cta-text {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--abao-red-deep);
}
.home-banner-deco {
  position: absolute;
  right: -20rpx;
  bottom: -20rpx;
  width: 240rpx;
  height: 240rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}
.home-banner-emoji {
  position: absolute;
  right: 36rpx;
  bottom: 28rpx;
  font-size: 128rpx;
  transform: rotate(-12deg);
}

/* ── [7] 堡内新闻 ── */
.home-news {
  padding: 16rpx 28rpx 44rpx;
}
.home-news-title {
  display: block;
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 800;
  color: var(--ink-900);
  margin-bottom: 16rpx;
}
.home-news-item {
  display: flex;
  gap: 20rpx;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1px solid var(--ink-100);
}
.home-news-item-body {
  flex: 1;
}
.home-news-item-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--ink-900);
  line-height: 1.4;
}
.home-news-item-date {
  display: block;
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 8rpx;
}

/* ── 错误状态 ── */
.home-error {
  padding: 120rpx 0;
}

/* ── 底部占位 ── */
.home-bottom-placeholder {
  height: 120rpx;
}
</style>
