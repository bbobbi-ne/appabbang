import { requireAccessTokenInstance } from './instance';

export interface GetBreadsSuccessResponse {
  success: true;
  breads: any;
}
export interface GetBreadsErrorResponse {
  success: false;
  message: string;
}

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
  image: File[];
}

// ✅ 빵 정보 조회
export async function getBreads(): Promise<any> {
  try {
    const response = await requireAccessTokenInstance.get<Bread[]>('/breads', {});
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
  throw new Error('테스트에러입니다.');
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    formData.append('image', file);
  });

  console.log(Array.from(formData));
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
export async function deleteBread(Bread: BreadFormData): Promise<any> {
  console.log(Bread);
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    formData.append('image', file);
  });

  console.log(Array.from(formData));
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

// ✅ 빵 업데이트
export async function updateBread(Bread: BreadFormData): Promise<any> {
  console.log(Bread);
  const formData = new FormData();

  formData.append('name', Bread.name);
  formData.append('description', Bread.description);
  formData.append('unitPrice', Bread.unitPrice);
  formData.append('breadStatus', Bread.breadStatus);

  Bread.image.forEach((file) => {
    formData.append('image', file);
  });

  console.log(Array.from(formData));
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
