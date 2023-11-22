const config = {
  API_URL: 'http://127.0.0.1:3000',
  ROOT_DIR: 'C:\Users\Admin\Downloads\ProJectCT449\Client'
}
export const OrderStatus = Object.freeze({
  ALL: ({
    name: "all",
    label: "All",
    query: {}
  }),
  TO_PAY: ({
    name: "topay",
    label: "Đã gửi",
    status: "Đơn hàng bạn đã đặt",
    query: {
      status: "TO_PAY"
    }
  }),
  TO_SHIP: ({
    name: "toship",
    label: "Chờ Giao Hàng",
    status: "Đơn hảng đang được giao đến bạn",
    query: {
      status: "TO_SHIP"
    }
  }),
  TO_RECEIVE: ({
    name: "toreceive",
    label: "Đã Giao",
    status: "Đã nhận được hàng",
    query: {
      status: "TO_RECEIVE"
    }
  }),
  COMPLETED: ({
    name: "completed",
    label: "Trả Hàng",
    status: "Đơn hàng đang được hoàn trả",
    query: {
      status: "COMPLETED"
    }
  }),
  CANCELLED: ({
    name: "cancelled",
    label: "Hủy",
    status: "Đơn hảng đã được hủy",
    query: {
      status: "CANCELLED"
    }
  })
});
export default config;