import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@appabbang/ui';
import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { useEffect } from 'react';
export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const getMe = useCallback(async () => {
    const response = await axios.get(`${import.meta.env.VITE_APPABBANG_API_URL}/auth/me`);
    console.log(response);
    console.log(response.data);
    return response.data;
  }, []);

  useEffect(() => {
    getMe();
  }, []);

  return (
    <div className="p-4">
      <div className="text-3xl">프로젝트 시작중..</div>
      <div className="mt-4"></div>

      <Button>Click me</Button>
    </div>
  );
}
