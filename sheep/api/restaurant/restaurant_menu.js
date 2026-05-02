import request from '@/sheep/request';

const MenuApi = {
  // 获取门店菜单
  getMenu: (storeId) => {
    return request({
      url: '/restaurant/menu/list',
      method: 'GET',
      params: { storeId },
      custom: {
        auth: false,
        showLoading: false,
      },
    });
  },
};

export default MenuApi;
