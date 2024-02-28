export var orderStatusEnum;
(function (orderStatusEnum) {
    orderStatusEnum["CART"] = "cart";
    orderStatusEnum["PAYMENT"] = "payment";
    orderStatusEnum["PROCESSING"] = "processing";
    orderStatusEnum["SENT"] = "sent";
    orderStatusEnum["RECEIVED"] = "received";
    orderStatusEnum["REFUND_PENDING"] = "refund_pending";
    orderStatusEnum["CANCELED"] = "canceled";
})(orderStatusEnum || (orderStatusEnum = {}));
