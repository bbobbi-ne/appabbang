import type { QueryFunctionContext } from '@tanstack/react-query';
import { toast } from '@appabbang/ui';
import { Breads } from '@/api/Breads';
import { CustomHttpClient } from './instance';
import type {
  BreadsCreatePayload,
  BreadsDeletePayload,
  ImageDeletePayload,
} from '@/api/data-contracts';

// Breads API 인스턴스 생성
const breadsApi = new Breads(new CustomHttpClient());

/**
 * 빵 전체 목록 조회
 */
export async function getBreads() {
  try {
    const response = await breadsApi.breadsList();
    // toast.success('빵 정보를 조회에 성공했습니다.');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.';
    toast.error('빵 정보를 불러오는데 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 빵 단일 상세 조회
 * @param queryKey - react-query의 queryKey, no를 포함해야 함
 */
export async function breadsDetail({ queryKey }: QueryFunctionContext<[string, { no: number }]>) {
  const [, params] = queryKey;
  try {
    const response = await breadsApi.breadsDetail(params.no);
    return { data: response.data! };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 정보를 불러오는데 실패했습니다.';
    toast.error('빵 정보를 불러오는데 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 빵 생성
 * @param formData - 빵 생성에 필요한 데이터 (이름, 가격 등)
 */
export async function breadsCreate({ formData }: { formData: BreadsCreatePayload; _: any }) {
  try {
    const response = await breadsApi.breadsCreate(formData);
    toast.success('빵 목록이 추가되었습니다.');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 목록 추가를 실패했습니다.';
    toast.error('빵 목록 추가를 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 빵 삭제
 * @param noList - 삭제할 빵 번호 배열
 */
export async function breadsDelete({ noList }: BreadsDeletePayload) {
  try {
    const response = await breadsApi.breadsDelete({ noList });
    toast.success('빵 목록삭제가 완료되었습니다.');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 삭제를 실패했습니다.';
    toast.error('빵 목록삭제를 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 빵 업데이트
 * @param formData - 수정할 데이터
 * @param no - 수정할 빵 번호
 */
export async function breadsUpdate({
  formData,
  no,
}: {
  formData: BreadsCreatePayload;
  no: number;
}) {
  try {
    const response = await breadsApi.breadsUpdate(no, formData);
    toast.success('빵 목록업데이트가 완료되었습니다.');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 목록 업데이트를 실패했습니다.';
    toast.error('빵 목록 업데이트를 실패했습니다.', { description: message });
    throw new Error(message);
  }
}

/**
 * 빵 이미지 삭제
 * @param publicId - 이미지 식별자
 * @param no - 빵 번호
 */
export async function imageDelete({ publicId, no }: ImageDeletePayload & { no: number }) {
  try {
    const response = await breadsApi.imageDelete({ publicId });
    toast.success('빵 이미지삭제에 성공했습니다.');
    return { data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || '빵 이미지삭제를 실패했습니다.';
    toast.error('빵 이미지삭제를 실패했습니다.', { description: message });
    throw new Error(message);
  }
}
