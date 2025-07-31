import Infomation from '../home/infomation-content';
import InstagramContent from '../home/instagram-content';
import OrderContent from '../home/order-content';
import SellPopularProducts from '../home/sell-popular-products-content';

function MainPage() {
  return (
    <>
      <OrderContent />
      <SellPopularProducts />
      <InstagramContent />
      <Infomation />
    </>
  );
}

export default MainPage;
