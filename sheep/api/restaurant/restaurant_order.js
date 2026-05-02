import request from '@/sheep/request';

const OrderApi = {
  // 创建订单
  createOrder: (data) => {
    return request({
      url: '/restaurant/order/create',
      method: 'POST',
      data,
      custom: {
        auth: true,
        showLoading: true,
        loadingMsg: '提交中...',
        showSuccess: true,
        successMsg: '订单提交成功',
      },
    });
  },
  // 订单详情
  getOrderDetail: (id) => {
    return request({
      url: '/restaurant/order/get',
      method: 'GET',
      params: { id },
      custom: {
        auth: true,
        showLoading: false,
      },
    });
  },
  // 订单列表
  getOrderPage: (params) => {
    return request({
      url: '/restaurant/order/page',
      method: 'GET',
      params,
      custom: {
        auth: true,
        showLoading: false,
      },
    });
  },
  // 取消订单
  cancelOrder: (id) => {
    return request({
      url: '/restaurant/order/cancel',
      method: 'POST',
      params: { id },
      custom: {
        auth: true,
        showLoading: true,
        loadingMsg: '取消中...',
      },
    });
  },
  // 订单数量统计
  getOrderCount: () => {
    return request({
      url: '/restaurant/order/count',
      method: 'GET',
      custom: {
        auth: true,
        showLoading: false,
      },
    });
  },
};

export default OrderApi;
