<template>
  <view class="student-page">
    <AbaoNavBar :dark="true" :showBack="true" />

    <view class="student-body">
      <scroll-view class="student-scroll" scroll-y>
        <!-- 头部 -->
        <view class="student-header">
          <AbaoLogo size="lg" />
          <text class="student-title">同学你好</text>
          <text class="student-title student-title--red">一杯朝气</text>
          <text class="student-label">ABAO · STUDENT CARD</text>
          <text class="student-desc">免费开卡 · 享专属权益</text>
          <text class="student-rules-link">规则详情 ›</text>
        </view>

        <!-- 5月权益卡片 -->
        <AbaoCard class="student-promo">
          <view class="student-tape" />
          <text class="student-promo-title">5月学生卡开通权益</text>
          <text class="student-promo-sub">首次开通立享 (限时活动)</text>

          <view class="student-coupon-main">
            <AbaoSeal class="student-coupon-seal" text="八折" />
            <view class="student-coupon-info">
              <text class="student-coupon-title">「学生专享」单杯 8 折券</text>
              <text class="student-coupon-desc">有效期内招牌系列单杯可用 ×3张</text>
            </view>
          </view>
        </AbaoCard>

        <!-- 本月特权礼券 -->
        <AbaoCard class="student-privileges">
          <text class="student-privileges-title">本月特权礼券</text>
          <text class="student-privileges-sub">可享学生专属礼券</text>

          <view v-for="(c, i) in privileges" :key="i" class="student-priv-item">
            <AbaoSeal :text="c.tag" />
            <view class="student-priv-info">
              <text class="student-priv-name">{{ c.title }}</text>
              <text class="student-priv-desc">{{ c.desc }}</text>
            </view>
          </view>
        </AbaoCard>

        <view class="bottom-placeholder" />
      </scroll-view>

      <!-- 底部按钮 -->
      <view class="student-footer">
        <button class="student-submit-btn">立即学生认证</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import AbaoNavBar from '@/components/abao/AbaoNavBar.vue';
import AbaoCard from '@/components/abao/AbaoCard.vue';
import AbaoLogo from '@/components/abao/AbaoLogo.vue';
import AbaoSeal from '@/components/abao/AbaoSeal.vue';

const privileges = [
  { tag: '八折', title: '「课间闲时」8 折券', desc: '工作日 13:30-17:30 适用' },
  { tag: '八折', title: '「双杯任选」8 折券', desc: '校园场景 邀同学共享' },
  { tag: '免单', title: '「四人同行」一人免单', desc: '满 4 杯下单立减一杯' },
  { tag: '免4元', title: '「免运费」配送费券', desc: '大学生活 外卖最爱' },
];
</script>

<style lang="scss" scoped>
.student-page {
  height: 100vh;
  background: linear-gradient(180deg, #F5EAE5 0%, #F6F4EB 100%);
}

.student-body {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.student-scroll {
  flex: 1;
}

/* 头部 */
.student-header {
  text-align: center;
  padding: 20rpx 32rpx 40rpx;
}

.student-title {
  display: block;
  font-family: var(--font-display);
  font-size: 68rpx;
  font-weight: 800;
  margin-top: 0;
  line-height: 1.1;
  color: var(--ink-900);

  &:first-child {
    margin-top: 24rpx;
  }
}
.student-title--red {
  color: var(--abao-red);
}

.student-label {
  display: block;
  font-size: 20rpx;
  color: var(--ink-500);
  letter-spacing: 6rpx;
  font-family: Helvetica, sans-serif;
  margin-top: 12rpx;
}

.student-desc {
  display: block;
  margin-top: 28rpx;
  font-size: 26rpx;
  color: var(--ink-700);
}

.student-rules-link {
  display: block;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: var(--abao-red);
}

/* 5月权益 */
.student-promo {
  margin: 0 24rpx 28rpx;
  padding: 28rpx;
  position: relative;
  overflow: hidden;
}

.student-tape {
  position: absolute;
  top: -16rpx;
  left: 40rpx;
  background: var(--abao-yellow);
  opacity: 0.85;
  height: 36rpx;
  width: 120rpx;
  transform: rotate(-3deg);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.student-promo-title {
  display: block;
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 800;
  text-align: center;
  margin-top: 12rpx;
  color: var(--ink-900);
}

.student-promo-sub {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 4rpx;
}

.student-coupon-main {
  margin-top: 28rpx;
  padding: 28rpx;
  background: linear-gradient(110deg, var(--abao-red) 0%, var(--abao-red-deep) 100%);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.student-coupon-seal {
  background: #fff;
  color: var(--abao-red);
  box-shadow: 0 0 0 4rpx var(--abao-red) inset, 0 0 0 6rpx #fff inset;
  flex-shrink: 0;
}

.student-coupon-info {
  flex: 1;
}

.student-coupon-title {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30rpx;
  color: #fff;
}

.student-coupon-desc {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4rpx;
}

/* 本月特权 */
.student-privileges {
  margin: 0 24rpx;
  padding: 28rpx;
}

.student-privileges-title {
  display: block;
  font-family: var(--font-display);
  font-size: 36rpx;
  font-weight: 800;
  text-align: center;
  color: var(--ink-900);
}

.student-privileges-sub {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: var(--ink-500);
  margin-top: 4rpx;
  margin-bottom: 28rpx;
}

.student-priv-item {
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: var(--abao-red-soft);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.student-priv-info {
  flex: 1;
}

.student-priv-name {
  display: block;
  font-weight: 700;
  font-size: 26rpx;
  color: var(--ink-900);
}

.student-priv-desc {
  display: block;
  font-size: 20rpx;
  color: var(--ink-700);
  margin-top: 4rpx;
}

.bottom-placeholder {
  height: 160rpx;
}

/* 底部按钮 */
.student-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 28rpx 40rpx;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.95) 40%);
}

.student-submit-btn {
  width: 100%;
  padding: 28rpx;
  background: var(--abao-red);
  color: #fff;
  border: none;
  border-radius: var(--r-pill);
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: var(--shadow-red);
}
</style>
