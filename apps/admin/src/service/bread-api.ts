import type { QueryFunctionContext } from '@tanstack/react-query';
import { baseInstance, requireAccessTokenInstance } from './instance';
import type { ApiResponse } from './common';
import { toast } from 'sonner';
export interface Breads {
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: string;
  image: string[];
}

export interface BreadImages {
  name: string;
  order: number;
  publicId: string;
  url: string;
}

export interface Bread {
  breadStatus: string;
  createdAt: string;
  description: string;
  images: BreadImages[];
  name: string;
  no: number;
  unitPrice: string;
  updatedAt: string;
}

export interface BreadFormData {
  name: string;
  description: string;
  unitPrice: string;
  breadStatus: string;
  image: (File | Record<string, any>)[];
}

export interface BreadUpdateFormData extends BreadFormData {
  no: number;
}
export interface BreadUpadteStatusData {
  no: number;
  breadStatus: string;
}

export interface BreadStatusItem {
  name: string;
  code: string;
}

export type BreadStatusResponse = BreadStatusItem[];

// ✅ 빵 정보 조회
export async function getBreads(): Promise<ApiResponse<Breads[]>> {
  try {
    const response = await requireAccessTokenInstance.get('/breads');
    // toast.success('빵 정보를 조회에 성공했습니다.');
    console.log(response, '빵 목록정보');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.';
    toast.error('빵 정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 빵 단일 정보 조회
export async function getBread({
  queryKey,
}: QueryFunctionContext<[string, { no: number }]>): Promise<ApiResponse<Bread>> {
  const [, params] = queryKey;

  try {
    const response = await requireAccessTokenInstance.get(`/breads/${params.no}`);
    console.log(response, '빵 단일정보');
    // toast.success('빵 정보를 조회에 성공했습니다.');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.';
    toast.error('빵 정보를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 빵 생성
export async function createBread(Bread: BreadFormData): Promise<ApiResponse<{}>> {
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    if (file instanceof File) {
      formData.append('image', file);
    }
  });

  try {
    const response = await requireAccessTokenInstance.post('/breads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('빵 목록이 추가되었습니다.');

    return {
      data: response.data,
    };
  } catch (error: any) {
    console.log(error);
    const message = error.response?.data?.message || '빵 목록 추가를 실패했습니다.';
    toast.error('빵 목록 추가를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 빵 삭제
export async function deleteBread(noList: number[]): Promise<ApiResponse<{}>> {
  try {
    const response = await requireAccessTokenInstance.delete('/breads', { data: { noList } });
    toast.success('빵 목록삭제가 완료되었습니다.');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 삭제를 실패했습니다.';
    toast.error('빵 목록삭제를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 빵 업데이트
export async function updateBread(Bread: BreadUpdateFormData): Promise<ApiResponse<{}>> {
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('no', String(Bread.no));
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    const isFile = typeof file === 'object' && file instanceof File;
    if (isFile) {
      formData.append('image', file);
    }
  });
  console.log(Array.from(formData));

  try {
    const response = await requireAccessTokenInstance.put(`/breads/${Bread.no}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('빵 목록업데이트가 완료되었습니다.');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 목록 업데이트를 실패했습니다.';
    toast.error('빵 목록 업데이트를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}
// ✅ 빵 상태 업데이트
export async function updateBreadStatus({
  breadStatus,
  no,
}: BreadUpadteStatusData): Promise<ApiResponse<{}>> {
  try {
    const response = await requireAccessTokenInstance.put(`/breads/${no}/status`, { breadStatus });
    toast.success('빵 상태가 업데이트 되었습니다.');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 상태 업데이트를 실패했습니다.';
    toast.error('빵 상태 업데이트를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

// ✅ 빵 이미지 삭제
export async function deleteBreadImg({
  no,
  publicId,
}: {
  no: number;
  publicId: string;
}): Promise<ApiResponse<{}>> {
  try {
    const response = await requireAccessTokenInstance.delete('/breads/image', {
      data: { no, publicId },
    });
    toast.success('빵 이미지삭제에 성공했습니다.');

    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 이미지삭제를 실패했습니다.';
    toast.error('빵 이미지삭제를 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}

export async function getBreadStatus(): Promise<ApiResponse<BreadStatusResponse>> {
  try {
    const response = await baseInstance.get('/common-code/bread_status');
    return {
      data: response.data,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || '빵 상태를 불러오는데 실패했습니다.';
    toast.error('빵 상태를 불러오는데 실패했습니다.', {
      description: message,
    });
    throw new Error(message);
  }
}
