<template>
  <view class="demo-page">
    <!-- ====== 页面头部 ====== -->
    <AbaoPageHeader title="组件库示例" subtitle="12 组件完整展示 · 阿堡设计语言" align="center" :showSeal="true" />

    <!-- ========================================== -->
    <!-- 组 1：品牌核心组件（3 个） -->
    <!-- ========================================== -->
    <view class="demo-divider"><text>品牌核心组件（3 个）</text></view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoLogo — 3 尺寸</text>
      <view class="demo-row">
        <AbaoLogo size="sm" /><AbaoLogo size="md" /><AbaoLogo size="lg" />
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoSeal — 3 文字</text>
      <view class="demo-row">
        <AbaoSeal text="堡" /><AbaoSeal text="认" /><AbaoSeal text="新" />
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">Tape — 3 variant</text>
      <view class="demo-row">
        <Tape text="新品上市" variant="red" />
        <Tape text="限时特惠" variant="yellow" />
        <Tape text="经典传承" variant="dark" />
      </view>
    </view>

    <!-- ========================================== -->
    <!-- 组 2：基础组件（4 个） -->
    <!-- ========================================== -->
    <view class="demo-divider"><text>基础组件（4 个）</text></view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoCard — 3 variant</text>
      <view class="demo-col">
        <AbaoCard variant="default">
          <text class="demo-card-text">default — 标准卡片（白底+阴影）</text>
        </AbaoCard>
        <AbaoCard variant="accent">
          <text class="demo-card-text">accent — 强调卡片（左侧红边）</text>
        </AbaoCard>
        <AbaoCard variant="minimal">
          <text class="demo-card-text">minimal — 极简卡片（浅底+细边）</text>
        </AbaoCard>
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoPageHeader — 含印章/胶带装饰</text>
      <AbaoPageHeader title="经营仪表盘" subtitle="今日数据概览" :showSeal="true" :showTape="true" />
      <view style="height:16rpx" />
      <AbaoPageHeader title="订单列表" subtitle="共 12 笔待处理" />
    </view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoStatCard — 含趋势（↑ ↓ →）</text>
      <view class="demo-row">
        <view class="demo-stat-wrap">
          <AbaoStatCard label="今日营业额" :value="12680" unit="元" trend="up" trendValue="+12.5%" />
        </view>
        <view class="demo-stat-wrap">
          <AbaoStatCard label="客单价" :value="42.5" unit="元" trend="down" trendValue="-3.2%" />
        </view>
        <view class="demo-stat-wrap">
          <AbaoStatCard label="订单数" :value="298" unit="笔" trend="flat" trendValue="持平" />
        </view>
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">AbaoSearchBar — 搜索栏</text>
      <view class="demo-col">
        <AbaoSearchBar placeholder="搜索菜品" />
        <AbaoSearchBar model-value="阿堡红烧肉" placeholder="搜索" />
      </view>
    </view>

    <!-- ========================================== -->
    <!-- 组 3：占位 + 按钮（2 个） -->
    <!-- ========================================== -->
    <view class="demo-divider"><text>占位 + 按钮（2 个）</text></view>

    <view class="demo-section">
      <text class="demo-section-title">Ph — 3 尺寸斜条纹占位</text>
      <view class="demo-col">
        <Ph text="菜品图片区" size="sm" />
        <Ph text="Banner广告位 750×400" size="md" />
        <Ph text="详情内容区" size="lg" />
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">Capsule — 3 variant × 3 size</text>
      <view class="demo-capsule-grid">
        <view class="demo-capsule-row" v-for="v in ['filled','outline','ghost']" :key="v">
          <text class="demo-capsule-label">{{ v }}</text>
          <Capsule :text="v" :variant="v" size="sm" />
          <Capsule :text="v" :variant="v" size="md" />
          <Capsule :text="v" :variant="v" size="lg" />
        </view>
      </view>
    </view>

    <!-- ========================================== -->
    <!-- 组 4：状态组件（3 个） -->
    <!-- ========================================== -->
    <view class="demo-divider"><text>状态组件（3 个）</text></view>

    <view class="demo-section">
      <text class="demo-section-title">EmptyState — 4 用户场景</text>
      <view class="demo-col">
        <view class="demo-row">
          <view class="demo-state-box">
            <text class="demo-scene-tag">顾客场景</text>
            <EmptyState scenario="customer" />
          </view>
          <view class="demo-state-box">
            <text class="demo-scene-tag">员工场景</text>
            <EmptyState scenario="employee" />
          </view>
        </view>
        <view class="demo-row">
          <view class="demo-state-box">
            <text class="demo-scene-tag">老板场景</text>
            <EmptyState scenario="boss" />
          </view>
          <view class="demo-state-box">
            <text class="demo-scene-tag">咨询师场景</text>
            <EmptyState scenario="consultant" />
          </view>
        </view>
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">LoadingSkeleton — 3 变体 + 高光扫过</text>
      <view class="demo-col">
        <view class="demo-state-box">
          <text class="demo-state-label">list</text>
          <LoadingSkeleton variant="list" :count="3" />
        </view>
        <view class="demo-state-box">
          <text class="demo-state-label">card</text>
          <LoadingSkeleton variant="card" :count="3" />
        </view>
        <view class="demo-state-box">
          <text class="demo-state-label">detail</text>
          <LoadingSkeleton variant="detail" :count="3" />
        </view>
      </view>
    </view>

    <view class="demo-section">
      <text class="demo-section-title">ErrorState — 3 错误类型</text>
      <view class="demo-row">
        <view class="demo-state-box">
          <text class="demo-scene-tag">网络错误</text>
          <ErrorState errorType="network" retry-text="重新加载" />
        </view>
        <view class="demo-state-box">
          <text class="demo-scene-tag">服务错误</text>
          <ErrorState errorType="server" retry-text="稍后重试" />
        </view>
        <view class="demo-state-box">
          <text class="demo-scene-tag">权限错误</text>
          <ErrorState errorType="permission" retry-text="申请权限" />
        </view>
      </view>
    </view>

    <view class="demo-footer"><text>12/12 组件 · 阿堡设计语言 V1</text></view>
  </view>
</template>

<script setup>
import AbaoLogo from '@/components/abao/AbaoLogo.vue'
import AbaoSeal from '@/components/abao/AbaoSeal.vue'
import Tape from '@/components/abao/Tape.vue'
import AbaoCard from '@/components/abao/AbaoCard.vue'
import AbaoPageHeader from '@/components/abao/AbaoPageHeader.vue'
import AbaoStatCard from '@/components/abao/AbaoStatCard.vue'
import AbaoSearchBar from '@/components/abao/AbaoSearchBar.vue'
import Ph from '@/components/abao/Ph.vue'
import Capsule from '@/components/abao/Capsule.vue'
import EmptyState from '@/components/abao/EmptyState.vue'
import LoadingSkeleton from '@/components/abao/LoadingSkeleton.vue'
import ErrorState from '@/components/abao/ErrorState.vue'
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 80rpx;
}

.demo-divider {
  padding: 40rpx 24rpx 16rpx;
  text-align: center;
}
.demo-divider text {
  font-family: var(--font-mono);
  font-size: 22rpx;
  color: var(--ink-300);
  letter-spacing: 2px;
}

.demo-section {
  background: #fff;
  border-radius: var(--r-lg);
  padding: 24rpx;
  margin: 0 20rpx 20rpx;
  box-shadow: var(--shadow-sm);
}

.demo-section-title {
  display: block;
  font-family: var(--font-body);
  font-size: 24rpx;
  font-weight: 600;
  color: var(--ink-500);
  margin-bottom: 16rpx;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16rpx;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.demo-card-text {
  font-family: var(--font-body);
  font-size: 26rpx;
  color: var(--ink-700);
}

.demo-stat-wrap {
  flex: 1;
  min-width: 200rpx;
}

/* Capsule 网格 */
.demo-capsule-grid {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.demo-capsule-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.demo-capsule-label {
  width: 100rpx;
  font-family: var(--font-mono);
  font-size: 20rpx;
  color: var(--ink-300);
  text-align: right;
  flex-shrink: 0;
}

/* 状态组件展示 */
.demo-state-box {
  flex: 1;
  min-width: 280rpx;
  background: var(--ink-100);
  border-radius: var(--r-md);
  overflow: hidden;
  position: relative;
}
.demo-scene-tag {
  display: block;
  font-family: var(--font-mono);
  font-size: 18rpx;
  color: var(--ink-300);
  padding: 8rpx 16rpx 0;
  letter-spacing: 1px;
}
.demo-state-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 18rpx;
  color: var(--ink-300);
  padding: 8rpx 16rpx 0;
}

.demo-footer {
  padding: 48rpx 0;
  text-align: center;
}
.demo-footer text {
  font-family: var(--font-mono);
  font-size: 20rpx;
  color: var(--ink-300);
}
</style>
