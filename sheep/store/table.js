import { defineStore } from 'pinia';

const table = defineStore({
  id: 'table',
  state: () => ({
    tableId: null,        // 当前桌台ID
    tableNo: '',          // 当前桌号
    area: '',             // 区域
    seatCapacity: 0,      // 容纳人数
  }),
  getters: {
    hasTable: (state) => !!state.tableId,
    tableLabel: (state) => state.tableNo ? `${state.tableNo}桌` : '',
  },
  actions: {
    setTable(tableId, tableNo, area, seatCapacity) {
      this.tableId = tableId;
      this.tableNo = tableNo;
      this.area = area;
      this.seatCapacity = seatCapacity;
    },
    clearTable() {
      this.tableId = null;
      this.tableNo = '';
      this.area = '';
      this.seatCapacity = 0;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'table-store',
      },
    ],
  },
});

export default table;
