import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import FaqPage from '@/components/pages/faq-page';

export const Route = createFileRoute('/_sub-page/faq')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="자주묻는질문">
      <FaqPage />
    </SubLayout>
  );
}
