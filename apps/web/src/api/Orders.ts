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
  OrdersCreatePayload,
  OrdersDetailData,
  OrdersListData,
  OrdersUpdateData,
  OrdersUpdatePayload,
  StatusUpdateBody,
  StatusUpdateResult,
  TrackingNumberUpdateData,
  TrackingNumberUpdateError,
  TrackingNumberUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, type RequestParams } from "./http-client";

export class Orders<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 모든 주문 목록을 조회합니다. (권한: 관리자만)
   *
   * @tags Orders
   * @name OrdersList
   * @summary 주문 목록 조회
   * @request GET:/orders
   * @secure
   * @response `200` `OrdersListData` 주문 목록 조회 성공
   */
  ordersList = (params: RequestParams = {}) =>
    this.http.request<OrdersListData, any>({
      path: `/orders`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 주문을 생성합니다. (권한: 선택적 로그인 - 회원/비회원 모두 가능)
   *
   * @tags Orders
   * @name OrdersCreate
   * @summary 주문 생성
   * @request POST:/orders
   * @secure
   * @response `201` `OrdersCreateData` 주문 생성 성공
   */
  ordersCreate = (data: OrdersCreatePayload, params: RequestParams = {}) =>
    this.http.request<OrdersCreateData, any>({
      path: `/orders`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 특정 주문의 상세 정보를 조회합니다. (권한: 관리자만)
   *
   * @tags Orders
   * @name OrdersDetail
   * @summary 주문 상세 조회
   * @request GET:/orders/{no}
   * @secure
   * @response `200` `OrdersDetailData` 주문 상세 조회 성공
   */
  ordersDetail = (no: number, params: RequestParams = {}) =>
    this.http.request<OrdersDetailData, any>({
      path: `/orders/${no}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 기존 주문의 정보를 수정합니다. (권한: 관리자만)
   *
   * @tags Orders
   * @name OrdersUpdate
   * @summary 주문 수정
   * @request PUT:/orders/{no}
   * @secure
   * @response `200` `OrdersUpdateData` 주문 수정 성공
   */
  ordersUpdate = (
    no: number,
    data: OrdersUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<OrdersUpdateData, any>({
      path: `/orders/${no}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
 * @description 특정 주문의 송장번호만 수정합니다. (권한: 관리자만)
 *
 * @tags Orders
 * @name TrackingNumberUpdate
 * @summary 주문 송장번호 수정
 * @request PUT:/orders/{no}/tracking-number
 * @secure
 * @response `200` `TrackingNumberUpdateData` 송장번호 수정 성공
 * @response `400` `{
  \** @example "유효하지 않은 주문 번호입니다." *\
    error?: string,

}` 잘못된 요청
 * @response `404` `{
  \** @example "주문을 찾을 수 없습니다." *\
    error?: string,

}` 주문을 찾을 수 없음
 */
  trackingNumberUpdate = (
    no: number,
    data: TrackingNumberUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.http.request<TrackingNumberUpdateData, TrackingNumberUpdateError>({
      path: `/orders/${no}/tracking-number`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 주문의 상태만 수정합니다. (권한: 관리자만)
   *
   * @tags Orders
   * @name StatusUpdate
   * @summary 주문 상태 수정
   * @request PUT:/orders/{no}/status
   * @secure
   * @response `200` `StatusUpdateResult` 주문 상태 수정 성공
   */
  statusUpdate = (
    no: number,
    data: StatusUpdateBody,
    params: RequestParams = {},
  ) =>
    this.http.request<StatusUpdateResult, any>({
      path: `/orders/${no}/status`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
