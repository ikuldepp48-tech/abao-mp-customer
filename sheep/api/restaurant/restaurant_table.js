import request from '@/sheep/request';

const TableApi = {
  // 扫桌台二维码识别
  scanTable: (storeId, tableId) => {
    return request({
      url: '/restaurant/table/scan',
      method: 'GET',
      params: { storeId, tableId },
      custom: {
        auth: false,
        showLoading: true,
        loadingMsg: '识别桌台中...',
      },
    });
  },
};

export default TableApi;
