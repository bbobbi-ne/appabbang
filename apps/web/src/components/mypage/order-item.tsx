export interface IOrderItem {
  no: number;
  breadName: string;
  breadImageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  countryOfOrigin?: string;
  allergyInfo?: string;
  orderNo: number;
  customerNo?: number;
  couponNo?: number | null;
}

function OrderItem({ item }: { item: IOrderItem }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-5">
        {item.breadImageUrl ? (
          <img className="w-20 h-20" src={item.breadImageUrl} alt="빵 이미지" />
        ) : (
          <img className="w-20 h-20" src="/images/no_image.jpg" alt="빵 이미지" />
        )}
        <div className="mt-2">
          <p>{item.breadName}</p>
          <div className="flex gap-2">
            <span>{item.unitPrice.toLocaleString()}원</span>
            <span>{item.quantity}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
