/*
  주문서에 있는 정보를 페이지로 관리하고자 사용하는 컴포넌트.
  ex. 주문정보, 결제정보
*/

function OrderCheckList() {
  return (
    // 아이템리스트에 맞게 div를 for문으로 돌릴 것.
    // Q. 아이템리스트는 DB에 저장되는 내용인가? 아직 모름
    <div className="flex items-center justify-center mt-auto mr-auto ml-auto mb-5 w-100 h-10 rounded-lg bg-[#ffffff] *:m-auto">
      <div className="rounded-4xl w-5 h-5 bg-[#393028]"></div>
      <div className="rounded-4xl w-5 h-5 bg-[#b4b4b4]"></div>
      <div className="rounded-4xl w-5 h-5 bg-[#b4b4b4]"></div>
      <div className="rounded-4xl w-5 h-5 bg-[#b4b4b4]"></div>
      <div className="rounded-4xl w-5 h-5 bg-[#b4b4b4]"></div>
    </div>
  );
}

export default OrderCheckList;
