export const CodeGroup = {
  BREAD_STATUS: 'bread_status',
  USER_ROLE: 'user_role',
  MATERIAL_TYPE: 'material_type',
  ORDER_STATUS: 'order_status',
  PURCHASE_STATUS: 'purchase_status',
  DELIVERY_TYPE: 'delivery_type',
} as const;

export type CodeGroupType = (typeof CodeGroup)[keyof typeof CodeGroup];
