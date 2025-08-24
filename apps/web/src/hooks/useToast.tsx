/**
 * [Toast 전용 hook]
 * type을 기준으로 어떤 경우의 alert기능을 수행할 것인지 switch로 나누었다.
 */

import { toast } from '@appabbang/ui';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

function useToast() {
  const addToast = ({ message, type = 'success' }: ToastProps) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast.error(message);
        break;
    }
  };

  return { addToast };
}

export default useToast;
