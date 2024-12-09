export interface OrdersResponseDto {
  statusCode: number;
  data: OrdersResponseData;
}

export interface OrdersResponseData {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
  list: List[];
}

export interface List {
  orderNo: number;
  saleChannel: string;
  channelOrderNo: string;
  isMember: string;
  isSubscription: string;
  isGift: string;
  memberCode: string;
  orderType: string;
  orderStatus: string;
  currency: string;
  baseItemPrice: number;
  itemPrice: number;
  gradeDiscount: number;
  itemCouponDiscount: number;
  itemPointAmount: number;
  deliveryPrice: number;
  deliveryIslandPrice: number;
  deliveryExtraPrice: number;
  deliveryCouponDiscount: number;
  deliveryPointAmount: number;
  totalPrice: number;
  totalDeliveryPrice: number;
  totalDiscountPrice: number;
  totalPoint: number;
  totalRefundPrice: number;
  totalPaymentPrice: number;
  ordererName: string;
  ordererEmail: string;
  ordererCall: string;
  isFirst: string;
  isCancelReq: string;
  unipassNumber: string;
  isRequestPayment: string;
  device: string;
  country: string;
  wtime: string;
  sections: Section[];
  payments: Payment[];
  formData: FormData;
}

export interface FormData {
  formConfigCode: string;
  inputType: string;
  isRequire: string;
  title: string;
  description: string;
  value: string;
  formConfigValue: string;
}

export interface Payment {
  paymentNo: string;
  pgName: string;
  isCancel: string;
  method: string;
  paymentStatus: string;
  paidPrice: number;
  taxFreePrice: number;
  paymentCompleteTime: string;
  cashReceipt: CashReceipt;
}

export interface CashReceipt {
  type: string;
  methodType: string;
  cashReceiptStatus: string;
  pgName: string;
  isRequire: string;
  isCustomer: string;
  completeTime: Date;
  issueNumber: string;
}

export interface Section {
  orderSectionNo: string;
  orderSectionCode: string;
  orderSectionStatus: string;
  isDeliveryHold: string;
  deliveryPrice: number;
  deliveryIslandPrice: number;
  deliveryExtraPrice: number;
  deliveryCouponDiscount: number;
  deliveryPointAmount: number;
  deliveryType: string;
  deliveryPayType: string;
  deliverySendTime: string;
  deliveryCompleteTime: string;
  pickupMemo: string;
  sectionItems: SectionItem[];
  delivery: Delivery;
  invoice: Invoice;
  cancelInfo: CancelInfo;
  returnInfo: ReturnInfo;
}

export interface CancelInfo {
  isCustomerRequest: string;
  cancelReason: string;
  cancelReasonDetail: string;
  refundPriceType: string;
  deliveryExtraPrice: number;
  etcPrice: number;
  etcPriceReason: string;
  refundAmount: number;
  refundTaxFreeAmount: number;
  refundPoint: number;
  isRefund: string;
  isAlternativeRefund: string;
  alternativeRefundData: string;
}

export interface Delivery {
  receiverName: string;
  receiverCall: string;
  zipcode: string;
  addr1: string;
  addr2: string;
  building: string;
  street: string;
  city: string;
  state: string;
  country: string;
  countryName: string;
  memo: string;
}

export interface Invoice {
  invoiceNo: string;
  parcelCompanyIdx: number;
  deliveryStatus: string;
  inputType: string;
  isTracking: string;
  isReturn: string;
}

export interface ReturnInfo {
  invoiceNo: string;
  parcelCompanyIdx: number;
  deliveryStatus: string;
  retrieveType: string;
  retrievePayType: string;
  isExchange: string;
  isRetrieved: string;
}

export interface SectionItem {
  orderSectionItemNo: string;
  channelOrderItemNo: string;
  channelOrderItemMemo: string;
  qty: number;
  gradeDiscount: number;
  itemCouponDiscount: number;
  itemPointAmount: number;
  isRestock: string;
  possibleClaimType: string;
  productInfo: ProductInfo;
}

export interface ProductInfo {
  prodNo: number;
  optionDetailCode: string;
  isIndividualOption: string;
  prodName: string;
  baseItemPrice: number;
  itemPrice: number;
  isTaxFree: string;
  weight: number;
  isRequireOption: string;
  optionInfo: object;
  prodSkuNo: string;
  optionSkuNo: string;
  customProdCode: string;
  downloadLimitTime: number;
  downloadLimitCnt: number;
  groupPassCode: string;
  groupPassDayCnt: number;
  returnableDay: number;
  origin: string;
  maker: string;
  brand: string;
}
