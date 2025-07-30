import { createFileRoute } from '@tanstack/react-router';
import OrderContent from '@/components/home/order-content';
import SellPopularProducts from '@/components/home/sell-popular-products-content';
import InstagramContent from '@/components/home/instagram-content';
import Infomation from '@/components/home/infomation-content';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <>
      <OrderContent />
      <SellPopularProducts />
      <InstagramContent />
      <Infomation />
    </>
  );
}
