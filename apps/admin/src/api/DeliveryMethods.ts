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
  ActiveListData,
  ActiveListError,
  DeliveryMethodsCreateData,
  DeliveryMethodsCreatePayload,
  DeliveryMethodsDeleteData,
  DeliveryMethodsDetailData,
  DeliveryMethodsDetailError,
  DeliveryMethodsListData,
  DeliveryMethodsListError,
  DeliveryMethodsUpdateData,
  DeliveryMethodsUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class DeliveryMethods<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * @description 배송 방법 목록을 조회합니다. 쿼리 파라미터가 있으면 deliveryTypeName이 포함됩니다.
 *
 * @tags Delivery Methods
 * @name DeliveryMethodsList
 * @summary 배송 방법 목록 조회
 * @request GET:/delivery-methods
 * @response `200` `DeliveryMethodsListData` 배송 방법 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  deliveryMethodsList = (params: RequestParams = {}) =>
    this.request<DeliveryMethodsListData, DeliveryMethodsListError>({
      path: `/delivery-methods`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description 새로운 배송 방법을 생성합니다.
   *
   * @tags Delivery Methods
   * @name DeliveryMethodsCreate
   * @summary 배송 방법 생성
   * @request POST:/delivery-methods
   * @response `201` `DeliveryMethodsCreateData` 배송 방법 생성 성공
   * @response `500` `void` 서버 오류
   */
  deliveryMethodsCreate = (data: DeliveryMethodsCreatePayload, params: RequestParams = {}) =>
    this.request<DeliveryMethodsCreateData, void>({
      path: `/delivery-methods`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description 활성화된 배송 방법만 조회합니다.
 *
 * @tags Delivery Methods
 * @name ActiveList
 * @summary 활성화된 배송 방법 목록 조회
 * @request GET:/delivery-methods/active
 * @response `200` `ActiveListData` 활성화된 배송 방법 목록 조회 성공
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  activeList = (params: RequestParams = {}) =>
    this.request<ActiveListData, ActiveListError>({
      path: `/delivery-methods/active`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 특정 배송 방법의 상세 정보를 조회합니다.
 *
 * @tags Delivery Methods
 * @name DeliveryMethodsDetail
 * @summary 배송 방법 상세 조회
 * @request GET:/delivery-methods/{no}
 * @response `200` `DeliveryMethodsDetailData` 배송 방법 상세 조회 성공
 * @response `404` `{
  \** @example "배송 방법을 찾을 수 없습니다." *\
    message?: string,
    details?: {
  \** @example 999 *\
    deliveryMethodNo?: number,

},

}` 배송 방법을 찾을 수 없음
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  deliveryMethodsDetail = (no: number, params: RequestParams = {}) =>
    this.request<DeliveryMethodsDetailData, DeliveryMethodsDetailError>({
      path: `/delivery-methods/${no}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description 기존 배송 방법의 정보를 수정합니다.
   *
   * @tags Delivery Methods
   * @name DeliveryMethodsUpdate
   * @summary 배송 방법 수정
   * @request PUT:/delivery-methods/{no}
   * @response `200` `DeliveryMethodsUpdateData` 배송 방법 수정 성공
   * @response `400` `void` 잘못된 요청 (배송 방법 번호 누락)
   * @response `500` `void` 서버 오류
   */
  deliveryMethodsUpdate = (
    no: number,
    data: DeliveryMethodsUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.request<DeliveryMethodsUpdateData, void>({
      path: `/delivery-methods/${no}`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 특정 배송 방법을 삭제합니다.
   *
   * @tags Delivery Methods
   * @name DeliveryMethodsDelete
   * @summary 배송 방법 삭제
   * @request DELETE:/delivery-methods/{no}
   * @response `204` `DeliveryMethodsDeleteData` 배송 방법 삭제 성공
   * @response `400` `void` 잘못된 요청 (배송 방법 번호 누락)
   * @response `500` `void` 서버 오류
   */
  deliveryMethodsDelete = (no: number, params: RequestParams = {}) =>
    this.request<DeliveryMethodsDeleteData, void>({
      path: `/delivery-methods/${no}`,
      method: 'DELETE',
      ...params,
    });
}
