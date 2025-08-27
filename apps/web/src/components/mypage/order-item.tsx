import type { OrdersDeliveryListData } from '@/api/data-contracts';

export type OrderItem = NonNullable<OrdersDeliveryListData['orderItems']>[number];

function OrderItem({ item }: { item: OrderItem }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-5">
        {item.breadImageUrl ? (
          <img className="w-20 h-20" src={item.breadImageUrl} alt="빵 이미지" />
        ) : (
          <img className="w-20 h-20" src="/images/no-image.png" alt="빵 이미지" />
        )}
        <div className="mt-2">
          <p>{item.breadName}</p>
          <div className="flex gap-2">
            <span>{item.unitPrice!.toLocaleString()}원</span>
            <span>{item.quantity}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
