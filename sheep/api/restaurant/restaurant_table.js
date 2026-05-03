import request from '@/sheep/request';

const TableApi = {
  // 扫桌台二维码识别（通过加密 token）
  scanTable: (token) => {
    return request({
      url: '/restaurant/table/scan',
      method: 'GET',
      params: { token },
      custom: {
        auth: false,
        showLoading: true,
        loadingMsg: '识别桌台中...',
      },
    });
  },
};

export default TableApi;
