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
  OrdersDeleteData,
  OrdersDetailData,
  OrdersListData,
  OrdersUpdateData,
  OrdersUpdatePayload,
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
   * @description 비회원 주문을 생성합니다. (권한: 없음 - 누구나 접근 가능)
   *
   * @tags Orders
   * @name OrdersCreate
   * @summary 주문 생성 (비회원)
   * @request POST:/orders
   * @response `201` `OrdersCreateData` 주문 생성 성공
   */
  ordersCreate = (data: OrdersCreatePayload, params: RequestParams = {}) =>
    this.http.request<OrdersCreateData, any>({
      path: `/orders`,
      method: "POST",
      body: data,
      type: ContentType.Json,
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
   * @description 특정 주문을 삭제합니다. (권한: 관리자만)
   *
   * @tags Orders
   * @name OrdersDelete
   * @summary 주문 삭제
   * @request DELETE:/orders/{no}
   * @secure
   * @response `204` `OrdersDeleteData` 주문 삭제 성공
   */
  ordersDelete = (no: number, params: RequestParams = {}) =>
    this.http.request<OrdersDeleteData, any>({
      path: `/orders/${no}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
