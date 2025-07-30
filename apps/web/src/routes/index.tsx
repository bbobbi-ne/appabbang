import MainPage from '@/components/pages/main-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: MainPage,
});
