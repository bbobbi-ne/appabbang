/** 주문번호 (채번) 생성 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20240622
  const time = now.getTime().toString().slice(-5); // 뒤 5자리 시간 밀리초
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${date}-${time}${random}`;
};
