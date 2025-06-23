import type { QueryFunctionContext } from '@tanstack/react-query';
import { requireAccessTokenInstance } from './instance';
export interface Bread {
  name: string;
  description: string;
  unitPrice: number;
  breadStatus: string;
  image: string[];
}
export interface BreadFormData {
  name: string;
  description: string;
  unitPrice: string;
  breadStatus: string;
  image: (File | Record<string, any>)[];
}

// ✅ 빵 정보 조회
export async function getBreads({
  queryKey,
}: QueryFunctionContext<[string, { no: number }?]>): Promise<any> {
  const [, params] = queryKey;

  const url = params?.no ? `/breads/${params.no}` : '/breads';

  try {
    const response = await requireAccessTokenInstance.get<Bread[]>(url, {});
    return {
      success: true,
      breads: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.',
    };
  }
}

// ✅ 빵 생성
export async function createBread(Bread: BreadFormData): Promise<any> {
  // return '완료!';
  // throw new Error('테스트에러입니다.');
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
    const response = await requireAccessTokenInstance.post<Bread>('/breads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      breads: response.data,
    };
  } catch (error: any) {
    console.log(error, '서버에러');
    return {
      success: false,
      message: error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.',
    };
  }
}

// ✅ 빵 삭제
export async function deleteBread(noList: number[]): Promise<any> {
  try {
    const response = await requireAccessTokenInstance.delete<any>('/breads', { data: { noList } });
    return {
      success: true,
      breads: response.data,
    };
  } catch (error: any) {
    console.log(error, '서버에러');
    return {
      success: false,
      message: error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.',
    };
  }
}

// ✅ 빵 업데이트
export async function updateBread({
  Bread,
  no,
}: {
  Bread: BreadFormData;
  no: number;
}): Promise<any> {
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('no', String(no));
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    const isFile = typeof file === 'object' && file instanceof File;
    if (isFile) {
      formData.append('image', file);
    }
  });

  try {
    const response = await requireAccessTokenInstance.put<Bread>(`/breads/${no}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      breads: response.data,
    };
  } catch (error: any) {
    console.log(error, '서버에러');
    return {
      success: false,
      message: error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.',
    };
  }
}

// ✅ 빵 이미지 삭제
export async function deleteBreadImg({
  no,
  publicId,
}: {
  no: number;
  publicId: string;
}): Promise<any> {
  try {
    const response = await requireAccessTokenInstance.delete<any>('/breads/image', {
      data: { no, publicId },
    });

    return {
      success: true,
      breads: response.data,
    };
  } catch (error: any) {
    console.log(error, '서버에러');
    return {
      success: false,
      message: error.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.',
    };
  }
}
