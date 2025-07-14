/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  BreadsCreateData,
  BreadsCreatePayload,
  BreadsDeleteData,
  BreadsDeletePayload,
  BreadsDetailData,
  BreadsDetailError,
  BreadsListData,
  BreadsListError,
  BreadsUpdateData,
  BreadsUpdatePayload,
  ImageDeleteData,
  ImageDeletePayload,
  StatusUpdateData,
  StatusUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class Breads<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description 빵 목록을 조회합니다. breadStatus 쿼리 파라미터로 상태별 필터링이 가능합니다.
 *
 * @tags Breads
 * @name BreadsList
 * @summary 빵 목록 조회
 * @request GET:/breads
 * @secure
 * @response `200` `BreadsListData` 빵 목록 조회 성공
 * @response `401` `{
  \** @example "Unauthorized" *\
    message?: string,

}` 인증 실패
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  breadsList = (
    query?: {
      /**
       * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
       * @example "10"
       */
      breadStatus?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<BreadsListData, BreadsListError>({
      path: `/breads`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description 새로운 빵을 등록합니다. 이미지 업로드가 선택적으로 가능합니다.
   *
   * @tags Breads
   * @name BreadsCreate
   * @summary 빵 등록
   * @request POST:/breads
   * @secure
   * @response `201` `BreadsCreateData` 빵 등록 성공
   * @response `400` `void` 잘못된 요청
   * @response `401` `void` 인증 실패
   * @response `500` `void` 서버 오류
   */
  breadsCreate = (data: BreadsCreatePayload, params: RequestParams = {}) =>
    this.request<BreadsCreateData, void>({
      path: `/breads`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description 여러 빵을 한 번에 삭제합니다.
   *
   * @tags Breads
   * @name BreadsDelete
   * @summary 빵 삭제 (여러건)
   * @request DELETE:/breads
   * @secure
   * @response `204` `BreadsDeleteData` 빵 삭제 성공
   * @response `401` `void` 인증 실패
   * @response `500` `void` 서버 오류
   */
  breadsDelete = (data: BreadsDeletePayload, params: RequestParams = {}) =>
    this.request<BreadsDeleteData, void>({
      path: `/breads`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
 * @description 특정 빵의 상세 정보를 조회합니다.
 *
 * @tags Breads
 * @name BreadsDetail
 * @summary 빵 상세 조회
 * @request GET:/breads/{no}
 * @secure
 * @response `200` `BreadsDetailData` 빵 상세 조회 성공
 * @response `400` `{
  \** @example "no는 필수입니다." *\
    message?: string,
    details?: {
  \** @example "no" *\
    param?: string,

},

}` 잘못된 요청 (no 파라미터 누락)
 * @response `401` `{
  \** @example "Unauthorized" *\
    message?: string,

}` 인증 실패
 * @response `404` `{
  \** @example "빵을 찾을 수 없습니다." *\
    message?: string,
    details?: {
  \** @example 999 *\
    breadNo?: number,

},

}` 빵을 찾을 수 없음
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  breadsDetail = (no: number, params: RequestParams = {}) =>
    this.request<BreadsDetailData, BreadsDetailError>({
      path: `/breads/${no}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description 기존 빵의 정보를 수정합니다. 이미지 업로드가 선택적으로 가능합니다.
   *
   * @tags Breads
   * @name BreadsUpdate
   * @summary 빵 수정
   * @request PUT:/breads/{no}
   * @secure
   * @response `200` `BreadsUpdateData` 빵 수정 성공
   * @response `400` `void` 잘못된 요청 (no 파라미터 누락)
   * @response `401` `void` 인증 실패
   * @response `404` `void` 빵을 찾을 수 없음
   * @response `500` `void` 서버 오류
   */
  breadsUpdate = (no: number, data: BreadsUpdatePayload, params: RequestParams = {}) =>
    this.request<BreadsUpdateData, void>({
      path: `/breads/${no}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * @description 빵의 상태만 수정합니다.
   *
   * @tags Breads
   * @name StatusUpdate
   * @summary 빵 상태 수정
   * @request PUT:/breads/{no}/status
   * @secure
   * @response `200` `StatusUpdateData` 빵 상태 수정 성공
   * @response `400` `void` 잘못된 요청 (no 파라미터 누락)
   * @response `401` `void` 인증 실패
   * @response `404` `void` 빵을 찾을 수 없음
   * @response `500` `void` 서버 오류
   */
  statusUpdate = (no: number, data: StatusUpdatePayload, params: RequestParams = {}) =>
    this.request<StatusUpdateData, void>({
      path: `/breads/${no}/status`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 특정 빵의 이미지를 삭제합니다.
   *
   * @tags Breads
   * @name ImageDelete
   * @summary 빵 이미지 삭제
   * @request DELETE:/breads/image
   * @secure
   * @response `204` `ImageDeleteData` 이미지 삭제 성공
   * @response `401` `void` 인증 실패
   * @response `500` `void` 서버 오류
   */
  imageDelete = (data: ImageDeletePayload, params: RequestParams = {}) =>
    this.request<ImageDeleteData, void>({
      path: `/breads/image`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
