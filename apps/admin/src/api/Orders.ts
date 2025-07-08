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
  OrdersCreateData,
  OrdersCreateError,
  OrdersCreatePayload,
  OrdersDeleteData,
  OrdersDetailData,
  OrdersListData,
  OrdersUpdateData,
  OrdersUpdatePayload,
} from './data-contracts';
import { ContentType, HttpClient, type RequestParams } from './http-client';

export class Orders<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 모든 주문 목록을 조회합니다.
   *
   * @tags Orders
   * @name OrdersList
   * @summary 주문 목록 조회
   * @request GET:/orders
   * @response `200` `OrdersListData` 주문 목록 조회 성공
   * @response `500` `void` 서버 오류
   */
  ordersList = (params: RequestParams = {}) =>
    this.request<OrdersListData, void>({
      path: `/orders`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
 * @description 비회원 주문을 생성합니다.
 *
 * @tags Orders
 * @name OrdersCreate
 * @summary 주문 생성 (비회원)
 * @request POST:/orders
 * @response `201` `OrdersCreateData` 주문 생성 성공
 * @response `400` `{
  \** @example "주문 금액이 일치하지 않습니다." *\
    message?: string,
    details?: {
  \** @example 15000 *\
    expectedTotal?: number,
  \** @example 14000 *\
    receivedTotal?: number,
  \** @example 16000 *\
    originalPrice?: number,
  \** @example 1000 *\
    discountAmount?: number,
  \** @example 0 *\
    deliveryFee?: number,

},

}` 잘못된 요청 (주문 금액 불일치 등)
 * @response `500` `{
  \** @example "Internal server error" *\
    message?: string,

}` 서버 오류
 */
  ordersCreate = (data: OrdersCreatePayload, params: RequestParams = {}) =>
    this.request<OrdersCreateData, OrdersCreateError>({
      path: `/orders`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 특정 주문의 상세 정보를 조회합니다.
   *
   * @tags Orders
   * @name OrdersDetail
   * @summary 주문 상세 조회
   * @request GET:/orders/{no}
   * @response `200` `OrdersDetailData` 주문 상세 조회 성공
   * @response `400` `void` 잘못된 요청 (주문 번호 누락)
   * @response `404` `void` 주문을 찾을 수 없음
   * @response `500` `void` 서버 오류
   */
  ordersDetail = (no: number, params: RequestParams = {}) =>
    this.request<OrdersDetailData, void>({
      path: `/orders/${no}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * @description 기존 주문의 정보를 수정합니다.
   *
   * @tags Orders
   * @name OrdersUpdate
   * @summary 주문 수정
   * @request PUT:/orders/{no}
   * @response `200` `OrdersUpdateData` 주문 수정 성공
   * @response `400` `void` 잘못된 요청 (주문 번호 누락)
   * @response `500` `void` 서버 오류
   */
  ordersUpdate = (no: number, data: OrdersUpdatePayload, params: RequestParams = {}) =>
    this.request<OrdersUpdateData, void>({
      path: `/orders/${no}`,
      method: 'PUT',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 특정 주문을 삭제합니다.
   *
   * @tags Orders
   * @name OrdersDelete
   * @summary 주문 삭제
   * @request DELETE:/orders/{no}
   * @response `204` `OrdersDeleteData` 주문 삭제 성공
   * @response `400` `void` 잘못된 요청 (주문 번호 누락)
   * @response `500` `void` 서버 오류
   */
  ordersDelete = (no: number, params: RequestParams = {}) =>
    this.request<OrdersDeleteData, void>({
      path: `/orders/${no}`,
      method: 'DELETE',
      ...params,
    });
}
