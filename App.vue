<script setup>
  import { onLaunch, onShow, onError } from '@dcloudio/uni-app';
  import sheep, { ShoproInit } from './sheep';
  import $store from '@/sheep/store';

  onLaunch(() => {
    // 加载Shopro底层依赖
    ShoproInit().then(() => {
      // 首次进入小程序 → 静默微信登录
      const userStore = $store('user');
      if (!userStore.isLogin) {
        sheep.$platform.useProvider('wechat').login();
      }
    });
  });

  onShow(() => {
    // #ifdef APP-PLUS
    // 获取urlSchemes参数
    const args = plus.runtime.arguments;
    if (args) {
    }

    // 获取剪贴板
    uni.getClipboardData({
      success: (res) => {},
    });
    // #endif
  });
</script>

<style lang="scss">
  @import '@/sheep/scss/index.scss';
</style>
